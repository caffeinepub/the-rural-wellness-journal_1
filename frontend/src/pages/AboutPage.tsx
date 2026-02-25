import { Heart, MapPin, GraduationCap } from 'lucide-react';
import ImagePlaceholder from '../components/common/ImagePlaceholder';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-terracotta/8 border-b border-terracotta/15 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-terracotta text-xs font-medium tracking-widest uppercase mb-4">
            <MapPin size={14} />
            <span>Càng Long, Vietnam</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">About</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            The story behind the journal and the person who keeps it.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Story Section */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Portrait */}
            <div className="lg:w-80 shrink-0 mx-auto lg:mx-0">
              <div className="relative">
                <div className="absolute -inset-3 bg-terracotta/10 rounded-2xl -z-10" />
                <ImagePlaceholder
                  variant="portrait"
                  aspectRatio="square"
                  label="Add Your Photo"
                  className="w-full max-w-xs mx-auto lg:max-w-none rounded-xl shadow-card"
                />
              </div>
              {/* Info Card */}
              <div className="mt-6 bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={16} className="text-terracotta shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Aspiring</p>
                    <p className="text-sm font-medium text-foreground">PMHNP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-sage shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Roots in</p>
                    <p className="text-sm font-medium text-foreground">Càng Long, Vietnam</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Heart size={16} className="text-terracotta fill-terracotta/30 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Committed to</p>
                    <p className="text-sm font-medium text-foreground">Healthcare Equity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                The Story Behind the Journal
              </h2>
              <div className="space-y-5 text-base text-foreground/85 leading-[1.85] font-sans">
                <p>
                  This journal is maintained by Kim Chau, a dedicated high school student in the U.S. and an aspiring Psychiatric-Mental Health Nurse Practitioner (PMHNP). Having deep roots in Càng Long, Vietnam, I created this project to document the mental health landscape and healthcare accessibility in my hometown.
                </p>
                <p>
                  Through personal stories, interviews with community members, and clinical observations, this journal aims to bridge the gap between rural experiences and modern healthcare insights. My work is driven by a commitment to healthcare equity and the belief that every community deserves compassionate, culturally-informed mental health support.
                </p>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1 bg-border" />
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                  <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                  <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Mission pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: '📖',
                    title: 'Personal Stories',
                    desc: 'First-hand accounts of mental health experiences in rural communities.',
                  },
                  {
                    icon: '🎙️',
                    title: 'Interviews',
                    desc: 'Conversations with community members and healthcare workers.',
                  },
                  {
                    icon: '🏥',
                    title: 'Clinical Observations',
                    desc: 'Nursing perspective on healthcare accessibility and gaps.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="bg-muted/40 rounded-xl p-4 border border-border">
                    <div className="text-2xl mb-2">{icon}</div>
                    <h3 className="font-serif font-semibold text-sm text-foreground mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="bg-sage-light/30 rounded-2xl border border-sage/20 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-10 flex-1">
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                Why This Matters
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Rural communities in Vietnam face significant barriers to mental healthcare — from stigma and limited resources to geographic isolation. By documenting these realities, this journal hopes to contribute to a broader conversation about healthcare equity and the importance of culturally-sensitive care.
              </p>
            </div>
            <div className="md:w-72 shrink-0 p-4 md:p-6">
              <ImagePlaceholder
                variant="field"
                aspectRatio="landscape"
                label="Field Photo Coming Soon"
                className="w-full h-48 md:h-56"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
