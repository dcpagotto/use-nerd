'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cart-store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

type CheckoutStep = 'cart' | 'address' | 'payment' | 'confirmation';
type PaymentMethod = 'pix' | 'credit_card' | 'mercado_pago' | 'cryptocurrency';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Address
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    // Customer
    name: '',
    email: '',
    cpf: '',
    phone: '',
  });

  useEffect(() => {
    if (items.length === 0 && currentStep === 'cart') {
      toast.error('Seu carrinho está vazio!');
      router.push('/produtos');
    }
  }, [items, currentStep, router]);

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData({
            ...formData,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          });
          toast.success('CEP encontrado!');
        }
      } catch (error) {
        console.error('Error fetching CEP:', error);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'cart') {
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      // Validate address
      if (!formData.name || !formData.email || !formData.cep) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (paymentMethod === 'pix') {
        // Generate PIX QR code (simulated)
        toast.success('PIX gerado! Escaneie o QR Code para pagar.');
      } else if (paymentMethod === 'cryptocurrency') {
        // Crypto payment gateway (Coinbase Commerce, BitPay, etc.)
        toast.success('Redirecionando para gateway de pagamento cripto...');
      } else {
        toast.success('Pagamento processado com sucesso!');
      }

      setCurrentStep('confirmation');
      clearCart();
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'cart', label: 'Carrinho', icon: '🛒' },
    { id: 'address', label: 'Endereço', icon: '📍' },
    { id: 'payment', label: 'Pagamento', icon: '💳' },
    { id: 'confirmation', label: 'Confirmação', icon: '✓' },
  ];

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="neon-text-purple mb-4 font-display text-display-2">
              Finalizar Compra
            </h1>
            <p className="text-gray-cyber-300">
              Complete seu pedido de forma rápida e segura
            </p>
          </div>

          {/* Steps Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < getCurrentStepIndex();

                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          isActive
                            ? 'border-neon-purple bg-neon-purple/20 shadow-neon-purple-sm'
                            : isCompleted
                            ? 'border-neon-blue bg-neon-blue/20'
                            : 'border-gray-cyber-600 bg-cyber-dark-100'
                        }`}
                      >
                        <span className="text-xl">{step.icon}</span>
                      </div>
                      <span
                        className={`text-sm ${
                          isActive ? 'text-neon-purple' : 'text-gray-cyber-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 ${
                          isCompleted ? 'bg-neon-blue' : 'bg-gray-cyber-700'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Cart Review Step */}
              {currentStep === 'cart' && (
                <div className="card-cyber-glow p-6">
                  <h2 className="mb-6 text-xl font-semibold text-white">
                    Revise seu Carrinho
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b border-gray-cyber-700 pb-4"
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-cyber bg-gradient-to-br from-neon-purple/20 to-neon-blue/20">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <p className="text-sm text-gray-cyber-400">
                            Quantidade: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-neon-purple">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="btn-neon-filled-purple mt-6 w-full"
                  >
                    Continuar para Endereço
                  </button>
                </div>
              )}

              {/* Address Step */}
              {currentStep === 'address' && (
                <div className="card-cyber-glow p-6">
                  <h2 className="mb-6 text-xl font-semibold text-white">
                    Dados de Entrega
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="name"
                        placeholder="Nome completo *"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="E-mail *"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="cpf"
                        placeholder="CPF *"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="text"
                        name="phone"
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <input
                        type="text"
                        name="cep"
                        placeholder="CEP *"
                        value={formData.cep}
                        onChange={handleInputChange}
                        onBlur={handleCepBlur}
                        maxLength={8}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="text"
                        name="street"
                        placeholder="Rua *"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="md:col-span-2 w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <input
                        type="text"
                        name="number"
                        placeholder="Número *"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="text"
                        name="complement"
                        placeholder="Complemento"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="md:col-span-2 w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <input
                        type="text"
                        name="neighborhood"
                        placeholder="Bairro *"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="Cidade *"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="Estado *"
                        value={formData.state}
                        onChange={handleInputChange}
                        maxLength={2}
                        className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setCurrentStep('cart')}
                      className="btn-neon-outline flex-1"
                    >
                      Voltar
                    </button>
                    <button onClick={handleNextStep} className="btn-neon-filled-purple flex-1">
                      Continuar para Pagamento
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="card-cyber-glow p-6">
                  <h2 className="mb-6 text-xl font-semibold text-white">
                    Método de Pagamento
                  </h2>

                  <div className="mb-6 space-y-3">
                    {/* PIX */}
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`flex w-full items-center gap-4 rounded-cyber border-2 p-4 transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-neon-purple bg-neon-purple/10'
                          : 'border-gray-cyber-700 bg-cyber-dark-100'
                      }`}
                    >
                      <div className="text-3xl">💳</div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">PIX</h3>
                        <p className="text-sm text-gray-cyber-400">
                          Pagamento instantâneo - Aprovação imediata
                        </p>
                      </div>
                      {paymentMethod === 'pix' && (
                        <div className="h-3 w-3 rounded-full bg-neon-purple shadow-neon-purple-sm" />
                      )}
                    </button>

                    {/* Credit Card */}
                    <button
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`flex w-full items-center gap-4 rounded-cyber border-2 p-4 transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-neon-purple bg-neon-purple/10'
                          : 'border-gray-cyber-700 bg-cyber-dark-100'
                      }`}
                    >
                      <div className="text-3xl">💰</div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Cartão de Crédito</h3>
                        <p className="text-sm text-gray-cyber-400">
                          Parcele em até 12x sem juros
                        </p>
                      </div>
                      {paymentMethod === 'credit_card' && (
                        <div className="h-3 w-3 rounded-full bg-neon-purple shadow-neon-purple-sm" />
                      )}
                    </button>

                    {/* Mercado Pago */}
                    <button
                      onClick={() => setPaymentMethod('mercado_pago')}
                      className={`flex w-full items-center gap-4 rounded-cyber border-2 p-4 transition-all ${
                        paymentMethod === 'mercado_pago'
                          ? 'border-neon-purple bg-neon-purple/10'
                          : 'border-gray-cyber-700 bg-cyber-dark-100'
                      }`}
                    >
                      <div className="text-3xl">🔷</div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Mercado Pago</h3>
                        <p className="text-sm text-gray-cyber-400">
                          Cartões, boleto e saldo em conta
                        </p>
                      </div>
                      {paymentMethod === 'mercado_pago' && (
                        <div className="h-3 w-3 rounded-full bg-neon-purple shadow-neon-purple-sm" />
                      )}
                    </button>

                    {/* Cryptocurrency */}
                    <button
                      onClick={() => setPaymentMethod('cryptocurrency')}
                      className={`flex w-full items-center gap-4 rounded-cyber border-2 p-4 transition-all ${
                        paymentMethod === 'cryptocurrency'
                          ? 'border-neon-purple bg-neon-purple/10'
                          : 'border-gray-cyber-700 bg-cyber-dark-100'
                      }`}
                    >
                      <div className="text-3xl">₿</div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Criptomoeda</h3>
                        <p className="text-sm text-gray-cyber-400">
                          Bitcoin, USDT, MATIC - Sem necessidade de carteira
                        </p>
                      </div>
                      {paymentMethod === 'cryptocurrency' && (
                        <div className="h-3 w-3 rounded-full bg-neon-purple shadow-neon-purple-sm" />
                      )}
                    </button>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setCurrentStep('address')}
                      className="btn-neon-outline flex-1"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={loading}
                      className="btn-neon-filled-purple flex-1"
                    >
                      {loading ? <LoadingSpinner /> : 'Finalizar Pedido'}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirmation Step */}
              {currentStep === 'confirmation' && (
                <div className="card-cyber-glow p-12 text-center">
                  <div className="mb-6 text-6xl">🎉</div>
                  <h2 className="neon-text-purple mb-4 text-3xl font-bold">
                    Pedido Realizado!
                  </h2>
                  <p className="mb-8 text-gray-cyber-300">
                    Seu pedido foi processado com sucesso. Você receberá um e-mail com os
                    detalhes.
                  </p>

                  {paymentMethod === 'pix' && (
                    <div className="mb-6 rounded-cyber border border-neon-purple/30 bg-neon-purple/10 p-6">
                      <p className="mb-2 text-sm text-gray-cyber-300">
                        Escaneie o QR Code abaixo para pagar:
                      </p>
                      <div className="mx-auto h-48 w-48 rounded-cyber bg-white"></div>
                      <p className="mt-2 text-xs text-gray-cyber-400">
                        PIX válido por 30 minutos
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cryptocurrency' && (
                    <div className="mb-6 rounded-cyber border border-neon-purple/30 bg-neon-purple/10 p-6">
                      <div className="mb-4 text-4xl text-center">₿</div>
                      <h3 className="mb-2 text-lg font-semibold text-white text-center">
                        Pagamento via Gateway Seguro
                      </h3>
                      <p className="mb-4 text-sm text-gray-cyber-300 text-center">
                        Você será redirecionado para nosso gateway de pagamento cripto.
                        Aceitos: Bitcoin, USDT, MATIC e outras.
                      </p>
                      <div className="rounded-cyber border border-neon-blue/30 bg-neon-blue/10 p-4">
                        <p className="text-xs text-gray-cyber-300 flex items-center gap-2">
                          🔒 <strong>Sem necessidade de carteira própria</strong>
                        </p>
                        <p className="mt-2 text-xs text-gray-cyber-400">
                          O pagamento é processado através de um gateway seguro (Coinbase Commerce/BitPay).
                          Você não precisa conectar sua carteira pessoal.
                        </p>
                      </div>
                      <p className="mt-4 text-xs text-gray-cyber-400 text-center">
                        A transação será registrada na blockchain Polygon para auditoria pública.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push('/produtos')}
                      className="btn-neon-outline flex-1"
                    >
                      Continuar Comprando
                    </button>
                    <button
                      onClick={() => router.push('/')}
                      className="btn-neon-filled-purple flex-1"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="card-cyber-glow sticky top-24 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Resumo do Pedido</h3>

                <div className="space-y-3 border-b border-gray-cyber-700 pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-cyber-400">Subtotal</span>
                    <span className="text-white">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-cyber-400">Frete</span>
                    <span className="text-neon-blue">Grátis</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-cyber-400">Desconto</span>
                    <span className="text-gray-cyber-400">R$ 0,00</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="neon-text-purple text-2xl font-bold">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>

                <div className="mt-6 rounded-cyber border border-neon-blue/30 bg-neon-blue/10 p-3">
                  <p className="text-xs text-gray-cyber-300">
                    🔒 Pagamento 100% seguro
                  </p>
                  <p className="mt-1 text-xs text-gray-cyber-400">
                    Seus dados estão protegidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
