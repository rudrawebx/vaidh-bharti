import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, LotusMark, Reveal } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { wellnessAreas } from "@/lib/site";
import herbs from "@/assets/herbs.jpg";

const doshas = [
  { name: "Vata", body: "The principle of movement — breath, circulation, nerve impulse, and the rhythm of the day." },
  { name: "Pitta", body: "The principle of transformation — digestion, metabolism, warmth and clarity of mind." },
  { name: "Kapha", body: "The principle of structure — stability, strength, lubrication and endurance." },
];

const pillars = [
  { title: "Dinacharya", body: "A daily routine matched to your constitution: waking, meals, movement and rest." },
  { title: "Ahara", body: "Food chosen for what your digestion can carry, in the season you are living in." },
  { title: "Nidra", body: "Sleep treated as medicine, not an afterthought." },
  { title: "Sadvritta", body: "Conduct and calm — the mental habits that keep the body steady." },
];

export const Route = createFileRoute("/ayurveda")({
  head: () => ({
    meta: [
      { title: "What Is Ayurveda? Doshas, Routine & Balance | Vaidh Bharti" },
      {
        name: "description",
        content:
          "An introduction to Ayurveda — constitution, the three doshas, daily routine, diet and balance — explained simply by Vaidh Jitender Bharti of Panchsheel Aarogya Dhaam.",
      },
      { property: "og:title", content: "What Is Ayurveda? Doshas, Routine & Balance | Vaidh Bharti" },
      {
        property: "og:description",
        content: "Constitution, doshas, daily routine and balance — Ayurveda explained simply.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/ayurveda" },
    ],
    links: [{ rel: "canonical", href: "/ayurveda" }],
  }),
  component: Ayurveda,
});

function Ayurveda() {
  return (
    <>
      <PageHero
        eyebrow="Understanding Ayurveda"
        title="Ayurveda Is More Than Treatment"
        intro="Ayurveda begins with the individual rather than the illness — how you digest, sleep, work and think, and what your constitution asks for."
        crumbs={[{ label: "Ayurveda" }]}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="overflow-hidden rounded-sm">
              <img
                src={herbs}
                alt="Ayurvedic herbs, roots and powders in brass and copper vessels"
                loading="lazy"
                width={1600}
                height={1104}
                className="w-full object-cover"
              />
            </Reveal>
            <Reveal delay={100} className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                Two people with the same complaint may need two different approaches, because their constitution
                (Prakriti), digestion, work and temperament differ. Ayurveda begins by understanding that difference.
              </p>
              <p>
                An Ayurvedic plan therefore looks at routine, food, rest and state of mind alongside herbal support and
                therapy. The aim is a balance that holds, rather than relief that fades.
              </p>
              <p>
                This is an educational overview. Anything you read here should be discussed with a qualified
                practitioner before you act on it.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="surface-sand border-y border-border py-20">
        <Container>
          <h2 className="text-3xl sm:text-4xl">The Three Doshas</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {doshas.map((d) => (
              <article key={d.name} className="hover-lift border border-border bg-card p-8">
                <LotusMark className="h-7 w-7 text-gold" />
                <h3 className="mt-6 text-2xl">{d.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <h2 className="text-3xl sm:text-4xl">Four Everyday Pillars</h2>
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title} className="bg-background p-8">
                <h3 className="text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-20 text-3xl sm:text-4xl">Areas of Wellness Support</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {wellnessAreas.map((a) => (
              <li key={a} className="border border-border bg-card px-5 py-3 text-sm">
                {a}
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className="mt-12 inline-flex rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
          >
            Discover Your Ayurvedic Path
          </Link>
        </Container>
      </section>
    </>
  );
}
