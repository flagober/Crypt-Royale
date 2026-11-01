import {VipShop} from './VipShop.jsx';
import {useEffect, useRef, useState} from 'react';
import {
  X, ShoppingBag, Mail, Bot, ArrowLeft, CheckCircle2, ShieldCheck,
  QrCode, CreditCard, Sparkles, AlertCircle, ExternalLink, Loader2
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
  getIdToken
}) {
  const [selection, setSelection] = useState({});
  const [checkoutPack, setCheckoutPack] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);

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
          setCheckoutUrl(null);
          setOrderInfo(null);
          setCheckoutError('');
        } else {
          closeRef.current();
        }
      }
      if (e.key !== 'Tab') return;
      const nodes = [...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
      const a = nodes[0], b = nodes.at(-1);
      if (e.shiftKey && document.activeElement === a) {
        b.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === b) {
        a.focus();
        e.preventDefault();
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

  const setAmount = (id, value) => {
    try {
      setSelection(s => updateCardSelection(s, id, value, inventory));
    } catch {
      // Reconciles and bounds on error.
    }
  };

  const handleOpenCheckout = pack => {
    setCheckoutPack(pack);
    setCheckoutUrl(null);
    setOrderInfo(null);
    setCheckoutError('');
    setPaymentMethod('mercadopago');
  };

  const handleStartPayment = async () => {
    if (!checkoutPack || purchasing) return;
    if (!authenticated || !getIdToken) {
      setCheckoutError('Por favor, entre na sua conta Google para comprar pacotes de Gold oficiais.');
      return;
    }
    setPurchasing(true);
    setCheckoutError('');
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Não foi possível obter autenticação da conta. Entre novamente.');
      const res = await fetch('https://crypt-royale-commerce-beta.onrender.com/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packId: checkoutPack.id,
          provider: 'mercadopago'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Serviço de pagamentos indisponível no momento.');
      }
      setOrderInfo(data.order);
      const url = data.checkoutUrl || data.sandboxCheckoutUrl;
      setCheckoutUrl(url);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Falha ao iniciar pagamento.');
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
                <CheckCircle2 size={12} /> Mercado Pago Ativo
              </span>
            </div>
            <h2 id="shop-title"><ShoppingBag /> Recursos para sua jornada</h2>
            <p>Pacotes oficiais com entrega instantânea e recibos salvos na sua conta.</p>
          </div>
          <button type="button" className="shop-close" onClick={onClose} aria-label="Fechar loja">
            <X size={22} />
          </button>
        </header>

        {/* Pacotes Oficiais de Gold */}
        <section className="shop-gold" aria-labelledby="gold-packs-title">
          <div className="shop-gold-heading">
            <div>
              <small>GOLD OFICIAL · ENTREGA IMEDIATA</small>
              <h3 id="gold-packs-title">Pacotes de Gold para sua Coleção</h3>
            </div>
            <span className="shop-gold-preview">5 pacotes oficiais</span>
          </div>
          <p>Escolha o tamanho do seu pacote. Pague via Pix ou Cartão com entrega atômica na sua conta.</p>

          <div className="shop-gold-grid">
            {GOLD_PACKS.map((pack, i) => (
              <article key={pack.id} className={`shop-gold-pack shop-gold-pack--${i}`}>
                <img
                  src={pack.image}
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
                  onClick={() => handleOpenCheckout(pack)}
                  aria-label={`Comprar ${pack.name} por ${goldPackPrice(pack)}`}
                >
                  Comprar {goldPackPrice(pack)}
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
          </div>
          <button type="button" onClick={onMail}>Abrir correio</button>
        </article>

        {/* Passe Sentinela */}
        <article className="shop-pass">
          <h3><Bot /> {AUTO_PASS.days} dias de Sentinela Automático</h3>
          <p className="shop-price">
            {AUTO_PASS.gold.toLocaleString('pt-BR')} <b>Gold</b> · {AUTO_PASS.dataFragments} <b>Fragmentos</b> · {AUTO_PASS.cards} <b>Cartas</b>
          </p>
          <p>
            {access.active
              ? `Sentinela ativo até ${new Date(access.until).toLocaleString('pt-BR')}. Comprar outro pacote soma mais sete dias.`
              : 'Libera o modo automático nas atividades. Sem assinatura recorrente; renove quando quiser.'}
          </p>

          <fieldset className="shop-card-selection">
            <legend>Entregar {AUTO_PASS.cards} cartas repetidas</legend>
            <p className="shop-selection-help">
              Use as setas para escolher quantas cópias repetidas de cada monstro quer entregar.
            </p>
            <div className="shop-cards">
              {Object.entries(inventory || {}).map(([id, n]) => {
                const limit = cardSelectionLimit(id, inventory);
                if (limit <= 0) return null;
                const current = selection[id] || 0;
                return (
                  <div key={id} className={`shop-copy-card ${current > 0 ? 'is-selected' : ''}`}>
                    <div className="shop-copy-art">
                      <img src={`/assets/cards/${id}-v001.png`} alt="" loading="lazy" />
                      <span className="shop-copy-badge">
                        {current > 0 ? `${current}/${limit} no passe` : `Até ${limit}`}
                      </span>
                    </div>
                    <h4>{CARD_BY_ID[id]?.name || id}</h4>
                    <p className="shop-copy-owned">{n} no inventário · {limit} repetidas</p>
                    <div className="shop-copy-stepper">
                      <button
                        type="button"
                        aria-label={`Diminuir cartas de ${CARD_BY_ID[id]?.name || id}`}
                        onClick={() => setAmount(id, current - 1)}
                        disabled={current <= 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        max={limit}
                        value={current}
                        onChange={e => setAmount(id, e.target.value)}
                        aria-label={`Quantidade de cartas de ${CARD_BY_ID[id]?.name || id}`}
                      />
                      <button
                        type="button"
                        aria-label={`Aumentar cartas de ${CARD_BY_ID[id]?.name || id}`}
                        onClick={() => setAmount(id, current + 1)}
                        disabled={current >= limit}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="shop-selection-count">{count} de {AUTO_PASS.cards} cartas selecionadas</p>
          </fieldset>

          <button
            type="button"
            className="shop-buy"
            disabled={count !== AUTO_PASS.cards || gold < AUTO_PASS.gold || fragments < AUTO_PASS.dataFragments || busy || !ready}
            onClick={() => onBuy(selection, request.current)}
          >
            Trocar recursos e ativar passe
          </button>
        </article>

        {/* Loja VIP */}
        <VipShop profile={profile} ownerId={ownerId} clockNow={clockNow} onBuyVip={onBuyVip} />

        {/* Retorno Visível */}
        <footer className="shop-footer">
          <button type="button" className="shop-back" onClick={onClose}>
            <ArrowLeft size={18} /> Voltar à arena
          </button>
        </footer>
      </section>

      {/* Modal Oficial de Checkout */}
      {checkoutPack && (
        <div className="shop-checkout-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <div className="shop-checkout-card">
            <button
              type="button"
              className="shop-checkout-close"
              onClick={() => { setCheckoutPack(null); setCheckoutUrl(null); }}
              aria-label="Fechar checkout"
            >
              <X size={20} />
            </button>

            {!checkoutUrl ? (
              <>
                <div className="shop-checkout-heading">
                  <small>VILA BYTE · PAGAMENTO OFICIAL</small>
                  <h3 id="checkout-title">Confirmar Compra</h3>
                </div>

                <div className="shop-checkout-summary">
                  <img src={checkoutPack.image} alt={checkoutPack.name} />
                  <div>
                    <h4>{checkoutPack.name}</h4>
                    <span className="shop-checkout-gold">+{checkoutPack.gold.toLocaleString('pt-BR')} Gold</span>
                    <span className="shop-checkout-price">{goldPackPrice(checkoutPack)}</span>
                  </div>
                </div>

                <div className="shop-checkout-methods">
                  <label className="shop-checkout-label">Forma de Pagamento Oficial:</label>
                  <div className="shop-methods-grid">
                    <button
                      type="button"
                      className={`shop-method-card ${paymentMethod === 'mercadopago' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentMethod('mercadopago')}
                    >
                      <QrCode size={22} className="text-cyan-400" />
                      <div>
                        <strong>Pix Instantâneo / Mercado Pago</strong>
                        <small>Aprovação e entrega imediata na conta</small>
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
                    onClick={handleStartPayment}
                  >
                    {purchasing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Gerando pagamento seguro…
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} /> Pagar {goldPackPrice(checkoutPack)} com Pix
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
                  <Sparkles size={40} className="text-yellow-400" />
                </div>
                <h3>Pagamento Aberto!</h3>
                <p>
                  O link de pagamento seguro do Mercado Pago foi gerado para <strong>+{checkoutPack.gold.toLocaleString('pt-BR')} Gold</strong>.
                </p>
                <div className="shop-success-receipt">
                  <small>PEDIDO GERADO</small>
                  <code>#CR-{orderInfo?.id ? orderInfo.id.slice(0, 8).toUpperCase() : 'PENDENTE'}</code>
                </div>
                <p className="text-xs text-slate-400 my-2">
                  Conclua o pagamento via Pix ou Cartão na aba do Mercado Pago. O Gold é creditado de forma atômica no seu perfil assim que o banco confirmar!
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shop-checkout-confirm"
                    style={{ textDecoration: 'none' }}
                  >
                    <ExternalLink size={18} /> Abrir Página de Pagamento
                  </a>
                  <button
                    type="button"
                    className="shop-checkout-cancel"
                    onClick={() => { setCheckoutPack(null); setCheckoutUrl(null); }}
                  >
                    Concluir e Voltar ao Jogo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
