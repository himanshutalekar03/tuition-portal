"use client";

const teachers = [
    {
      name: 'Aarti Sharma',
      subject: 'Mathematics',
      experience: '8+ years',
      photo: '/images/aarti.png',
      intro: 'Passionate about simplifying math and making it enjoyable for all students.',
    },
    {
      name: 'Rajeev Menon',
      subject: 'Science',
      experience: '10+ years',
      photo: '/images/rajeev.png',
      intro: 'Believes in hands-on learning and inquiry-based education.',
    },
    {
      name: 'Neha Patil',
      subject: 'Social Science',
      experience: '6+ years',
      photo: '/images/neha.png',
      intro: 'Helps students connect history and civics with real-world understanding.',
    },
  ];
  
  const TeachersSection = () => {
    return (
      <section className="bg-white py-20 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Meet Our Expert Educators</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            Our team of highly experienced and dedicated teachers is committed to nurturing student success and fostering a love for learning.
          </p>
  
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-slate-200">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 text-left">
                  <h3 className="text-xl font-semibold text-slate-900">{teacher.name}</h3>
                  <p className="text-indigo-600 font-medium">{teacher.subject} • {teacher.experience}</p>
                  <p className="mt-3 text-slate-600 text-sm">{teacher.intro}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default TeachersSection;
