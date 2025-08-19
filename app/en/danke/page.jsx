export default function ThankYou() {
  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl md:text-4xl font-bold">Thanks for your request!</h1>
      <p className="mt-3 text-white/80">We will get back to you within 24 hours.</p>
      <a href="/en" className="inline-block mt-6 px-5 py-3 rounded-xl" style={{ background: "#f464b0" }}>
        Back to homepage
      </a>
    </section>
  );
}
