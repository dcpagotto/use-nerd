export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          USE Nerd - E-commerce com Rifas Blockchain
        </h1>
        <p className="text-center text-lg mb-4">
          Plataforma de e-commerce com sistema de rifas verificadas por blockchain na rede Polygon
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">E-commerce</h2>
            <p>Loja completa com produtos e checkout integrado</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Rifas Blockchain</h2>
            <p>Sistema de rifas transparente verificado na blockchain</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Pagamentos BR</h2>
            <p>PIX, Mercado Pago e NFe automático</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Frontend: Next.js 14 • Backend: Medusa v2 • Blockchain: Polygon</p>
        </div>
      </div>
    </main>
  );
}
