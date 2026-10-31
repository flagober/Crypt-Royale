// Internal preparation step; never calls this an IPA or an App Store release.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
if(process.platform!=='darwin'){console.error('A compilação/assinatura iOS exige macOS e Xcode. O pacote é um projeto para Mac, não um IPA.');process.exit(1);}
for(const [cmd,args]of [['xcodebuild',['-version']],['pod',['--version']]])if(spawnSync(cmd,args,{stdio:'inherit'}).status!==0)throw Error('Instale Xcode e CocoaPods antes de preparar o iOS.');
if(!fs.existsSync(path.join(root,'node_modules/@capacitor/cli/bin/capacitor')))throw Error('Execute npm ci na pasta extraída.');
if(!fs.existsSync(path.join(root,'dist/release-info.json')))throw Error('Pacote sem conteúdo web de versão verificada.');
const copy=spawnSync(process.execPath,[path.join(root,'node_modules/@capacitor/cli/bin/capacitor'),'sync','ios'],{cwd:root,stdio:'inherit'});if(copy.status!==0)throw Error('Sincronização iOS falhou.');
console.log('Projeto preparado. Abra ios/App/App.xcworkspace, selecione sua equipe Apple e valide em um iPhone. Nenhum IPA foi gerado ou enviado. Consulte docs/IOS-APP-STORE.md antes da distribuição.');
