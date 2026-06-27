"use client";

const FounderSection = () => {
    return (
      <section className="bg-slate-50 py-20 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          <div className="md:col-span-1 text-center">
            {/* Replaced Next.js Image with standard img tag for compatibility */}
            <img
              src="/images/founder.png"
              alt="Himanshu Talekar"
              style={{width: 180, height: 180}}
              className="rounded-full mx-auto mb-4 border-4 border-white shadow-xl"
            />
            <h3 className="text-2xl font-bold text-slate-800">Himanshu Talekar</h3>
            <p className="text-indigo-600 font-semibold">Founder & CEO, EduTech</p>
          </div>
          <div className="md:col-span-2">
            <blockquote className="relative text-lg italic text-slate-700 p-6 bg-white rounded-lg shadow-md border-l-4 border-indigo-500">
              <p className="before:content-['“'] before:absolute before:left-2 before:top-4 before:text-5xl before:text-indigo-200 before:font-serif after:content-['”'] after:absolute after:-bottom-4 after:right-4 after:text-5xl after:text-indigo-200 after:font-serif">
                Our vision at EduTech is to empower every student with quality education,
                personalized guidance, and a platform that nurtures the future leaders of tomorrow.
              </p>
            </blockquote>
          </div>
        </div>
      </section>
    );
  };
  
  export default FounderSection;
  