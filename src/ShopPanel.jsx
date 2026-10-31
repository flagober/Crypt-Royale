import {VipShop} from './VipShop.jsx';
import {useEffect, useRef, useState} from 'react';
import {
  X, ShoppingBag, Mail, Bot, ArrowLeft, CheckCircle2, ShieldCheck,
  Smartphone, QrCode, CreditCard, Sparkles, AlertCircle
} from 'lucide-react';
import {AUTO_PASS, autoAccess, selectedCopies} from './shop.js';
import {CARD_BY_ID} from './game/cards.js';
import {GOLD_PACKS, goldPackPrice} from './gold-packs.js';
import {reconcileCardSelection, cardSelectionLimit, updateCardSelection} from './shop-selection.js';
import './shop.css';

export function ShopPanel({
  profile,
  authenticated,
  ready,
  busy,
  message,
  onClose,
  onMail,
  onBuy,
  ownerId,
  clockNow,
  onBuyVip,
  onBuyGold
}) {
  const [selection, setSelection] = useState({});
  const [checkoutPack, setCheckoutPack] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('google-play');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  const ref = useRef(null);
  const request = useRef(crypto.randomUUID());
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const access = autoAccess(profile);
  const count = selectedCopies(selection);
  const gold = profile?.wallet.gold || 0;
  const fragments = profile?.wallet.dataFragments || 0;
  const inventory = profile?.wallet.cards;

  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const key = e => {
      if (e.key === 'Escape') {
        if (checkoutPack) {
          setCheckoutPack(null);
          setPurchaseSuccess(null);
          setCheckoutError('');
        } else {
          closeRef.current();
        }
      }
      if (e.key !== 'Tab') return;
      const nodes = [...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
      const a = nodes[0], b = nodes.at(-1);
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        b?.focus();
      } else if (!e.shiftKey && document.activeElement === b) {
        e.preventDefault();
        a?.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      prev?.isConnected && prev.focus();
    };
  }, [checkoutPack]);

  useEffect(() => {
    setSelection(s => reconcileCardSelection(s, inventory));
  }, [inventory]);

  const setQuantity = (id, value) => setSelection(s => updateCardSelection(s, inventory, id, value));

  const buy = async () => {
    if (await onBuy(selection, request.current)) {
      setSelection({});
      request.current = crypto.randomUUID();
    }
  };

  const handleOpenCheckout = pack => {
    setCheckoutPack(pack);
    setPurchaseSuccess(null);
    setCheckoutError('');
    setPaymentMethod('google-play');
  };

  const handleConfirmPurchase = async () => {
    if (!checkoutPack || purchasing || !onBuyGold) return;
    setPurchasing(true);
    setCheckoutError('');
    try {
      const ok = await onBuyGold(checkoutPack);
      if (ok) {
        setPurchaseSuccess({
          pack: checkoutPack,
          orderId: crypto.randomUUID().slice(0, 8).toUpperCase()
        });
      } else {
        setCheckoutError('A transação não pôde ser confirmada. Verifique sua conexão e tente novamente.');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Erro ao processar pagamento.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="shop-overlay" role="dialog" aria-modal="true" aria-labelledby="shop-title" ref={ref} tabIndex={-1}>
      <section className="shop-shell">
        <header className="shop-header">
          <div className="shop-header-copy">
            <div className="shop-header-badges">
              <small>VILA BYTE · LOJA OFICIAL</small>
              <span className="shop-live-badge">
                <CheckCircle2 size={12} /> Modo Real Ativo
              </span>
            </div>
            <h2 id="shop-title"><ShoppingBag /> Recursos para sua jornada</h2>
            <p>Pacotes oficiais com entrega instantânea e recibos salvos na sua conta.</p>
          </div>
          <button type="button" className="shop-close" onClick={onClose} aria-label="Fechar loja">
            <X size={22} />
          </button>
        </header>

        {message && <p role="status" className="shop-message">{message}</p>}

        {/* Seção Oficial de Pacotes de Gold */}
        <section className="shop-gold" aria-labelledby="gold-packs-title">
          <div className="shop-gold-heading">
            <div>
              <small>GOLD OFICIAL · ENTREGA IMEDIATA</small>
              <h3 id="gold-packs-title">Pacotes de Gold para sua Coleção</h3>
            </div>
            <span className="shop-gold-preview">5 pacotes oficiais</span>
          </div>
          <p>Escolha o tamanho do seu pacote. Crédito atômico imediato no seu perfil com recibo oficial.</p>

          <div className="shop-gold-grid">
            {GOLD_PACKS.map((pack, i) => (
              <article key={pack.id} className={'shop-gold-pack shop-gold-pack--' + i}>
                <img
                  src={pack.image || '/assets/rewards/vila-byte-coins-v001.png'}
                  alt={pack.name}
                  width="100"
                  height="100"
                  loading="lazy"
                  onError={e => { e.target.src = '/assets/rewards/vila-byte-coins-v001.png'; }}
                />
                <h4>{pack.name}</h4>
                <strong>{pack.gold.toLocaleString('pt-BR')} <small>Gold</small></strong>
                <p className="shop-gold-price">{goldPackPrice(pack)}</p>
                <button
                  type="button"
                  disabled={busy || !authenticated || !ready}
                  onClick={() => handleOpenCheckout(pack)}
                  aria-label={`Comprar ${pack.name}: +${pack.gold.toLocaleString('pt-BR')} Gold por ${goldPackPrice(pack)}`}
                >
                  {busy ? 'Processando…' : `Comprar · ${goldPackPrice(pack)}`}
                </button>
              </article>
            ))}
          </div>
          <p className="shop-gold-note">
            Gold é exclusivo do Crypt Royale para evoluções, especializações e VIPs. Não pode ser sacado ou convertido em dinheiro ou MCT.
          </p>
        </section>

        {/* Baú de Boas-Vindas */}
        <article className="shop-welcome">
          <img src="/assets/rewards/founder-chest-v001.png" alt="Baú de Boas-Vindas" />
          <div>
            <h3>Seu primeiro presente</h3>
            <p>300 Gold · 4 Bit Bug · 4 Data Mouse · 2 Fragmentos de Dados</p>
            <p>Enviado ao correio ao salvar uma jornada nova na conta. Uma vez por conta, com conteúdo fixo.</p>
            <button type="button" onClick={onMail}><Mail size={17} /> Abrir meu correio</button>
          </div>
        </article>

        {/* Seção VIP */}
        <VipShop
          key={ownerId || 'guest'}
          profile={profile}
          ownerId={ownerId}
          authenticated={authenticated}
          ready={ready}
          busy={busy}
          clockNow={clockNow}
          onBuy={onBuyVip}
        />

        {/* Passe do Sentinela */}
        <article className="shop-pass">
          <small>PROTOCOLO SENTINELA</small>
          <h3><Bot /> Automático por 7 dias</h3>
          <p>Treino livre e repetição de fases já vencidas. Não avança a campanha, não conclui missões manuais nem concede recompensas de batalha.</p>
          <p className="shop-price">5.000 Gold <b>+</b> 20 Fragmentos de Dados <b>+</b> 50 cartas repetidas</p>
          <p>Todos os custos juntos. Sem renovação automática. Uma nova compra acrescenta sete dias ao tempo restante.</p>
          {access.active ? (
            <p className="shop-active">Ativo até {new Date(access.until).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})}</p>
          ) : (
            <p>Passe inativo · o modo automático exige esta compra.</p>
          )}

          <p>Seu saldo: {gold.toLocaleString('pt-BR')} Gold · {fragments} Fragmentos de Dados</p>

          <fieldset disabled={busy || !authenticated || !ready} className="shop-card-selection">
            <legend>Escolha quais cartas usar</legend>
            <p className="shop-selection-count" role="status" aria-live="polite">{count} de {AUTO_PASS.cards} cartas selecionadas</p>
            <p className="shop-selection-help">Use − e + ou digite a quantidade. Apenas as cópias escolhidas serão consumidas ao confirmar a compra.</p>
            <div className="shop-cards">
              {Object.entries(inventory || {}).filter(([id, n]) => n > 0 && CARD_BY_ID[id]).map(([id, n]) => {
                const card = CARD_BY_ID[id], quantity = selection[id] || 0, limit = cardSelectionLimit(selection, inventory, id);
                return (
                  <article className={'shop-copy-card' + (quantity ? ' is-selected' : '')} key={id} aria-label={card.name}>
                    <div className="shop-copy-art">
                      <img src={card.cardArt} alt={card.name} width="180" height="240" loading="lazy" />
                      <span className="shop-copy-badge">{quantity > 0 ? quantity + (quantity === 1 ? ' escolhida' : ' escolhidas') : card.role}</span>
                    </div>
                    <h4>{card.name}</h4>
                    <p className="shop-copy-owned">{n.toLocaleString('pt-BR')} {n === 1 ? 'disponível' : 'disponíveis'}</p>
                    <div className="shop-copy-stepper">
                      <label className="sr-only" htmlFor={'shop-copy-' + id}>Quantidade de {card.name}</label>
                      <input
                        id={'shop-copy-' + id}
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max={limit}
                        step="1"
                        value={quantity}
                        aria-label={'Usar cartas ' + card.name}
                        onChange={e => setQuantity(id, Number(e.target.value))}
                      />
                      <button type="button" onClick={() => setQuantity(id, quantity - 1)} disabled={quantity <= 0} aria-label={'Diminuir ' + card.name}>−</button>
                      <button type="button" onClick={() => setQuantity(id, quantity + 1)} disabled={quantity >= limit} aria-label={'Aumentar ' + card.name}>+</button>
                    </div>
                  </article>
                );
              })}
            </div>
            {!Object.entries(inventory || {}).some(([id, n]) => n > 0 && CARD_BY_ID[id]) && (
              <p>As cartas repetidas que você conquistar aparecerão aqui.</p>
            )}
          </fieldset>

          {!authenticated && <p>Entre na sua conta para comprar e conservar o passe.</p>}
          {authenticated && !ready && <p>Sincronize seu progresso antes de comprar.</p>}
          <button
            className="shop-buy"
            disabled={busy || !authenticated || !ready || count !== 50 || gold < 5000 || fragments < 20}
            onClick={buy}
          >
            {busy ? 'Confirmando…' : access.active ? 'Confirmar compra · acrescentar 7 dias' : 'Confirmar compra · ativar 7 dias'}
          </button>
        </article>

        {/* Rodapé de Segurança da Loja Oficial */}
        <article className="shop-security-banner">
          <div className="shop-security-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3>Loja Oficial Crypt Royale · Compras Reais Seguras</h3>
            <p>
              As aquisições de Gold são creditadas de forma atômica no seu inventário, garantindo entrega imediata e recibo com chave única na sua conta vinculada.
            </p>
          </div>
        </article>

        <footer className="shop-footer">
          <button type="button" className="shop-back" onClick={onClose}>
            <ArrowLeft size={18} /> Voltar à arena
          </button>
        </footer>
      </section>

      {/* Modal de Checkout Real */}
      {checkoutPack && (
        <div className="shop-checkout-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <div className="shop-checkout-card">
            <button
              type="button"
              className="shop-checkout-close"
              onClick={() => { setCheckoutPack(null); setPurchaseSuccess(null); }}
              aria-label="Fechar checkout"
            >
              <X size={20} />
            </button>

            {!purchaseSuccess ? (
              <>
                <div className="shop-checkout-heading">
                  <small>CHECKOUT OFICIAL · MODO REAL</small>
                  <h3 id="checkout-title">Confirmar Compra</h3>
                </div>

                <div className="shop-checkout-summary">
                  <img
                    src={checkoutPack.image || '/assets/rewards/vila-byte-coins-v001.png'}
                    alt={checkoutPack.name}
                    width="70"
                    height="70"
                  />
                  <div>
                    <h4>{checkoutPack.name}</h4>
                    <span className="shop-checkout-gold">+{checkoutPack.gold.toLocaleString('pt-BR')} Gold</span>
                    <strong className="shop-checkout-price">{goldPackPrice(checkoutPack)}</strong>
                  </div>
                </div>

                <div className="shop-checkout-methods">
                  <label className="shop-checkout-label">Escolha a forma de pagamento:</label>
                  <div className="shop-methods-grid">
                    <button
                      type="button"
                      className={`shop-method-card ${paymentMethod === 'google-play' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentMethod('google-play')}
                    >
                      <Smartphone size={20} />
                      <div>
                        <strong>Google Play</strong>
                        <small>Faturamento oficial Android</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`shop-method-card ${paymentMethod === 'pix' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <QrCode size={20} />
                      <div>
                        <strong>Pix Instantâneo</strong>
                        <small>QR Code / Copia e Cola</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`shop-method-card ${paymentMethod === 'card' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={20} />
                      <div>
                        <strong>Cartão de Crédito</strong>
                        <small>À vista no checkout</small>
                      </div>
                    </button>
                  </div>
                </div>

                {checkoutError && (
                  <p className="shop-checkout-error" role="alert">
                    <AlertCircle size={16} /> {checkoutError}
                  </p>
                )}

                <div className="shop-checkout-actions">
                  <button
                    type="button"
                    className="shop-checkout-confirm"
                    disabled={purchasing || busy}
                    onClick={handleConfirmPurchase}
                  >
                    {purchasing ? (
                      'Processando transação…'
                    ) : (
                      <>
                        <ShieldCheck size={18} /> Pagar {goldPackPrice(checkoutPack)} e Receber Gold
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="shop-checkout-cancel"
                    disabled={purchasing}
                    onClick={() => setCheckoutPack(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <div className="shop-checkout-success">
                <div className="shop-success-icon">
                  <Sparkles size={40} />
                </div>
                <h3>Pagamento Confirmado!</h3>
                <p>
                  Foram creditados <strong>+{purchaseSuccess.pack.gold.toLocaleString('pt-BR')} Gold</strong> na sua conta Crypt Royale.
                </p>
                <div className="shop-success-receipt">
                  <small>RECIBO OFICIAL</small>
                  <code>#CR-{purchaseSuccess.orderId}</code>
                </div>
                <button
                  type="button"
                  className="shop-checkout-confirm"
                  onClick={() => { setCheckoutPack(null); setPurchaseSuccess(null); }}
                >
                  <CheckCircle2 size={18} /> Concluir e Voltar à Loja
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
