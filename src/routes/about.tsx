import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Reveal, Signature } from "@/components/site/primitives";
import { PageHero } from "@/components/site/PageHero";
import { panchsheel, portraitUrl } from "@/lib/site";
import centreImg from "@/assets/centre.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vaidh Jitender Bharti — Ayurvedic Expert in Hansi, Haryana" },
      {
        name: "description",
        content:
          "Vaidh Jitender Bharti, founder and owner of Panchsheel Aarogya Dhaam, has over 20 years of experience in Ayurveda — his story, philosophy and patient-centric approach to healing.",
      },
      { property: "og:title", content: "About Vaidh Jitender Bharti — Ayurvedic Expert in Hansi, Haryana" },
      {
        property: "og:description",
        content: "The story, philosophy and Ayurvedic approach of Vaidh Jitender Bharti, founder and owner of Panchsheel Aarogya Dhaam.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="The Person Behind the Healing"
        title="A Life Dedicated to the Wisdom of Ayurveda"
        intro="“Ayurved Amrit Hai, Ise Apnaao” — the belief that has guided over two decades of practice."
        crumbs={[{ label: "About" }]}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <img
                src={portraitUrl}
                alt="Portrait of Vaidh Jitender Bharti, founder and owner of Panchsheel Aarogya Dhaam"
                loading="lazy"
                width={768}
                height={1024}
                className="w-full rounded-sm object-cover shadow-[0_40px_90px_-50px_rgba(31,45,37,0.75)]"
              />
              <Signature className="mt-8 h-12 w-48 text-gold" />
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Vaidh Jitender Bharti — Owner & Founder, Panchsheel Aarogya Dhaam
              </p>
            </Reveal>

            <Reveal delay={100} className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                Vaidh Jitender Bharti is an Ayurvedic expert with over 20 years of experience and the founder and owner of{" "}
                <span className="text-foreground">Panchsheel Aarogya Dhaam</span>, a holistic Ayurvedic wellness centre
                in Hansi, Haryana, dedicated to restoring health through the ancient science of Ayurveda.
              </p>
              <p>
                His practice is guided by a simple conviction —{" "}
                <em className="text-foreground">“Ayurveda is not just treatment, it's a lifestyle.”</em> Rather than
                treating a complaint in isolation, he works to understand its root: constitution, digestion, sleep,
                daily rhythm and state of mind.
              </p>
              <p>
                At the centre he combines time-tested Ayurvedic therapies, personalized herbal treatments, Panchakarma,
                diet counselling and lifestyle guidance in a serene, nature-based environment. His compassionate,
                patient-centric approach has made the centre a place people turn to for chronic complaints, stress and
                lifestyle disorders — offering not only care, but a complete path to physical, mental and spiritual
                wellbeing.
              </p>
              <p>For Vaidh Jitender Bharti, healing is not a business. It is a sacred mission.</p>

              <h2 className="pt-6 font-display text-3xl text-foreground">
                A Father's Promise: The Inspiration Behind the Mission
              </h2>
              <p>
                The turning point in Vaidh Jitender Bharti's life came through a deeply personal loss. His daughter,{" "}
                <span className="text-foreground">Diksha Bharti</span>, was diagnosed with cancer at the age of three.
                Despite every effort, he was unable to save her. Her passing left a permanent mark on his life.
              </p>
              <p>
                In an act of extraordinary courage, he donated her whole body to the Anatomy Department at Rohtak
                Medical College so that her life could contribute to medical research and education, and donated her
                eyes so that someone else might see. In June 2016, he also donated his father's whole body for medical
                science.
              </p>
              <p>
                That loss became the seed of a lifelong mission: to study deeper, to serve further, and to make
                authentic Ayurvedic care available to families who need it. His work today is not only professional —
                it is personal.
              </p>

              <blockquote className="border-l-2 border-gold/60 pl-6 font-display text-2xl italic leading-snug text-foreground">
                “Ayurveda is not just treatment, it's a lifestyle. Let's return to our roots and heal naturally.”
              </blockquote>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="surface-sand border-y border-border py-20">
        <Container>
          <h2 className="text-3xl sm:text-4xl">The Panchsheel Approach</h2>
          <p className="mt-3 text-muted-foreground">Five principles. One complete approach to wellbeing.</p>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {panchsheel.map((p) => (
              <li key={p.n} className="border border-border bg-card p-6">
                <span className="font-display text-3xl text-gold/70">{p.n}</span>
                <h3 className="mt-4 text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <img
              src="/assets/real/clinic-cottage.jpeg"
              alt="Authentic traditional cottage therapy suites at Panchsheel Aarogya Dhaam"
              loading="lazy"
              width={1600}
              height={1104}
              className="w-full rounded-sm object-cover shadow-lg"
            />
            <div>
              <h2 className="text-3xl sm:text-4xl">Visit Panchsheel Aarogya Dhaam</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                The centre in Hansi is designed to be quiet and unhurried — a place where a consultation is a
                conversation, and where therapies are carried out with care and attention.
              </p>
              <Link
                to="/book"
                className="mt-8 inline-flex rounded-sm bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
