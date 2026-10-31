const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {backup,mirror,hash,read,write,run,list,nextRelease,releaseNamespace,mirrorReleaseConflict,stamp,frozenSource,tools,prepareSigning}=require('./release-tools.cjs');
const canonical='C:\\MonsterCrypt_Ecosystem_V1.0\\Crypt-Royale';
const destination='G:\\Meu Drive\\MonsterCrypt_Ecosystem_V1.0\\Crypt-Royale';
const root=path.resolve(__dirname,'..');
const args=process.argv.slice(2);
if(root.toLowerCase()!==canonical.toLowerCase()){
 const result=spawnSync(process.execPath,[path.join(canonical,'scripts','gerar-pacote.cjs'),...args],{stdio:'inherit'});process.exit(result.status??1);
}
const cache=path.join(process.env.LOCALAPPDATA,'MonsterCrypt','CryptRoyale','Builds');
const lock=path.join(cache,'generation.lock');let handle,stage;
try{
 if(args.some(a=>!['--verificar','--manter-versao'].includes(a)))throw Error('Opção desconhecida. Use --verificar ou --manter-versao.');
 const toolchain=tools();
 for(const file of ['node_modules/electron-builder/cli.js','node_modules/@capacitor/cli/bin/capacitor','android/gradle/wrapper/gradle-wrapper.jar'])if(!fs.existsSync(path.join(root,file)))throw Error('Dependência ausente: '+file+'. Execute npm ci na pasta local.');
 if(!fs.existsSync(destination))throw Error('Google Drive indisponível; nenhuma versão será alterada.');
 const current=read(path.join(root,'versao.json'));
 const driveVersion=path.join(destination,'versao.json');
 if(fs.existsSync(driveVersion)){
  const other=read(driveVersion);
  if(mirrorReleaseConflict(current,other))throw Error('O espelho anuncia versão mais recente. Confira as duas cópias; não será importado código automaticamente.');
 }
 if(args.includes('--verificar')){console.log(`Preflight OK. Versão atual ${current.versao}; próxima ${nextRelease(current).versao}, build ${nextRelease(current).buildNumber}; JDK17, SDK36, Windows, APK e AAB disponíveis. Nenhuma versão ou chave alterada.`);process.exit(0);}
 fs.mkdirSync(cache,{recursive:true});
 try{handle=fs.openSync(lock,'wx');fs.writeFileSync(handle,JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));}catch{throw Error('Já existe uma geração em andamento. Não remova a trava sem conferir o processo.');}
 const version=nextRelease(current,args.includes('--manter-versao'));
 const history=read(path.join(root,'src','data','release-history.json'));
 if(version.cicloVersao>1&&history[0]?.cicloVersao!==version.cicloVersao)throw Error(`Registre cicloVersao: ${version.cicloVersao} nas notas da próxima versão ${version.versao}; preserve as notas antigas.`);
 if(!Array.isArray(history)||history[0]?.versao!==version.versao||!history[0]?.resumo||!Array.isArray(history[0]?.alteracoes)||!history[0].alteracoes.length)throw Error(`Registre as alterações de v${version.versao} em src/data/release-history.json antes de gerar. Para repetir a atual, use --manter-versao com as notas atuais.`);
 if(!fs.readFileSync(path.join(root,'docs','NOTAS_DAS_VERSOES.md'),'utf8').includes('— v'+version.versao+' ·'))throw Error('Faltam as notas documentadas da versão '+version.versao+'.');
 if(!args.includes('--manter-versao')){
  const summary=fs.readFileSync(path.join(root,'docs','NOTAS_DAS_VERSOES.md'),'utf8').match(/^Resumo:\s*(.+)$/m);
  if(summary)version.resumo=summary[1].trim();
 }
 stage=path.join(cache,`${version.versao}-${Date.now()}-${crypto.randomUUID().slice(0,8)}`);
 fs.mkdirSync(stage,{recursive:true});
 const sources=frozenSource(root),original=Object.fromEntries(sources.map(file=>[file,hash(path.join(root,file))]));
 for(const file of sources){const target=path.join(stage,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);if(hash(target)!==original[file])throw Error('Cópia congelada divergente: '+file);}
 stamp(stage,version);
 const metadata=['versao.json','package.json','package-lock.json','android/app/build.gradle','docs/NOTAS_DAS_VERSOES.md',...(fs.existsSync(path.join(stage,'ios/App/App.xcodeproj/project.pbxproj'))?['ios/App/App.xcodeproj/project.pbxproj']:[])];
 const frozenMetadata=Object.fromEntries(metadata.map(file=>[file,hash(path.join(stage,file))]));
 const signing=prepareSigning(toolchain);
 console.log(`\nCRYPT ROYALE v${version.versao} — Windows + APK + AAB beta — build ${version.buildNumber}\nCópia congelada: ${stage}`);
 // No builds run in the Drive or mutate player data. Both share the same exact web output.
 const npm=path.join(path.dirname(process.execPath),'node_modules','npm','bin','npm-cli.js');
 if(!fs.existsSync(npm))throw Error('npm CLI não encontrado junto ao Node.js.');
 run(process.execPath,[npm,'ci','--no-audit','--no-fund'],{cwd:stage,env:{...process.env,CI:'1'}});
 run(process.execPath,[npm,'test'],{cwd:stage});
 run(process.execPath,[npm,'run','build'],{cwd:stage});
 const releaseNotes=`# Crypt Royale v${version.versao}\n\nBuild ${version.buildNumber}. Windows e Android gerados da mesma cópia congelada.\n\n`+fs.readFileSync(path.join(stage,'docs','NOTAS_DAS_VERSOES.md'),'utf8');
 write(path.join(stage,'dist','release-notes.md'),releaseNotes);
 const releaseInfo={...version,sha256Notas:hash(path.join(stage,'dist','release-notes.md'))};
 write(path.join(stage,'dist','release-info.json'),releaseInfo);
 const webFiles=list(path.join(stage,'dist')).map(file=>path.relative(stage,file).replaceAll('\\','/')).sort();
 const webHashes=Object.fromEntries(webFiles.map(file=>[file,hash(path.join(stage,file))]));
 console.log('\n[1/2] Gerando e verificando APK release assinado...');
 const {apk,aab}=require('./build-android.cjs').buildAndroid(stage,version,toolchain,signing);
 console.log('\n[2/2] Gerando instalador Windows e verificando aplicativo empacotado...');
 const exe=require('./build-windows.cjs').buildWindows(stage,version);
 const iosProject=fs.existsSync(path.join(stage,'ios/App/App.xcodeproj/project.pbxproj'))?require('./build-ios-source.cjs').buildIosSource(stage,version):null;
 for(const [file,expected]of Object.entries(webHashes))if(hash(path.join(stage,file))!==expected)throw Error('Conteúdo web alterado entre plataformas: '+file);
 for(const [file,expected]of Object.entries(frozenMetadata))if(hash(path.join(stage,file))!==expected)throw Error('Metadados alterados durante build: '+file);
 for(const [file,expected]of Object.entries(original))if(!fs.existsSync(path.join(root,file))||hash(path.join(root,file))!==expected)throw Error('O projeto foi alterado durante a geração. Pacote não publicado; execute novamente: '+file);
 for(const file of webFiles){
  const native=path.join(stage,'android','app','src','main','assets','public',file.slice('dist/'.length));
  if(!fs.existsSync(native)||hash(native)!==webHashes[file])throw Error('Conteúdo APK divergente do Windows: '+file);
 }
 const dirs=releaseNamespace(version);
 const outputs=[`${dirs.android}/Crypt_Royale_v${version.versao}.apk`,`${dirs.windows}/Crypt Royale Setup ${version.versao}.exe`,`${dirs.android}/Crypt_Royale_v${version.versao}_BETA.aab`,...(iosProject?[`${dirs.packages}/v${version.versao}/Crypt_Royale_v${version.versao}_Projeto_iOS.zip`]:[])];
 const notes=`${dirs.packages}/v${version.versao}/notas.md`,manifest=`${dirs.packages}/v${version.versao}/manifesto.json`;
 const structuredNotes=`${dirs.packages}/v${version.versao}/notas.json`,flatNotes=`${dirs.packages}/v${version.versao}-notas.json`,flatManifest=`${dirs.packages}/v${version.versao}-manifesto.json`;
 const published=[...metadata.filter(f=>f!=='docs/NOTAS_DAS_VERSOES.md'),...outputs,notes,structuredNotes,manifest,flatNotes,flatManifest];
 // Back up every public replacement before committing the version or either binary.
 backup(published.map(file=>path.join(root,file)),'cryptroyale-before-release-publish');
 for(const file of metadata.filter(f=>f!=='docs/NOTAS_DAS_VERSOES.md')){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.copyFileSync(path.join(stage,file),path.join(root,file));}
 for(const [source,target]of [[apk,outputs[0]],[exe,outputs[1]],[aab,outputs[2]],...(iosProject?[[iosProject,outputs[3]]]:[])]){fs.mkdirSync(path.dirname(path.join(root,target)),{recursive:true});fs.copyFileSync(source,path.join(root,target));if(hash(source)!==hash(path.join(root,target)))throw Error('Artefato copiado com divergência: '+target);}
 write(path.join(root,notes),releaseNotes);
 write(path.join(root,structuredNotes),{...history[0],buildNumber:version.buildNumber,historico:history});
 fs.copyFileSync(path.join(root,structuredNotes),path.join(root,flatNotes));
 write(path.join(root,manifest),{version,createdAt:new Date().toISOString(),notas:notes,sha256Notas:hash(path.join(root,notes)),metadados:frozenMetadata,web:webHashes,source:original,artefatos:outputs.map(file=>({arquivo:file,bytes:fs.statSync(path.join(root,file)).size,sha256:hash(path.join(root,file))})),androidSignature:'release — chave própria mantida somente no C',windowsSignature:'Instalador sem certificado Authenticode',validacao:{tests:true,androidSignature:true,sameWebContent:true,windowsPackagedSmoke:true,windowsNativeMetadata:true}});
 const savedManifest=read(path.join(root,manifest));savedManifest.notasEstruturadas=structuredNotes;savedManifest.sha256NotasEstruturadas=hash(path.join(root,structuredNotes));savedManifest.validacao.androidBundleSignature=true;savedManifest.ios={projeto:iosProject?outputs[3]:null,arquivoCompilado:false,assinatura:false,publicadoAppStore:false,pendencias:['Conta Apple Developer','Mac/Xcode e CocoaPods','Sign in with Apple e exclusão da conta','Testes reais e revisão App Store']};write(path.join(root,manifest),savedManifest);fs.copyFileSync(path.join(root,manifest),path.join(root,flatManifest));
 mirror(root,destination,published);
 console.log(`\nPACOTE v${version.versao} CONCLUÍDO E ESPELHADO.\n${outputs.map(file=>path.join(root,file)).join('\n')}\nManifesto: ${path.join(root,manifest)}`);
}catch(error){console.error('\nGeração não concluída: '+error.message);if(stage)console.error('Cópia de diagnóstico preservada em '+stage);process.exitCode=1;}
finally{if(handle!==undefined){fs.closeSync(handle);fs.unlinkSync(lock);}}
