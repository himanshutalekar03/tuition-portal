"use client";

import React from "react";
import TopperCard from "./TopperCard"; // make sure path is correct

const toppers = [
  {
    name: "Rahul Verma",
    photo: "/images/rahul.png",
    maths: 95,
    science: 97,
    sst: 94,
  },
  {
    name: "Shreya Sharma",
    photo: "/images/shreya.png",
    maths: 98,
    science: 96,
    sst: 95,
  },
  {
    name: "Ankit Yadav",
    photo: "/images/ankit.png",
    maths: 94,
    science: 93,
    sst: 96,
  },
];

const TopperSection = () => {
  return (
    <section className="bg-slate-50 py-20 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          Our Academic Achievers
        </h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Celebrating the hard work and dedication of our top-performing students.
        </p>

        {/* Topper Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {toppers.map((student, index) => (
            <TopperCard key={index} {...student} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopperSection;
