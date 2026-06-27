"use client";

import React from "react";

const TopperCard = ({ name, photo, maths = 0, science = 0, sst = 0 }) => {
  const totalSubjects = 3;
  const percentage = ((maths + science + sst) / totalSubjects).toFixed(2);

  return (
    <div className="w-full max-w-xs bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        {/* Student Photo */}
        <img
          src={photo || "/default-avatar.png"}
          alt={`${name} photo`}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Percentage Badge */}
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow">
          {percentage}%
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 text-center">
        <h5 className="mb-2 text-xl font-bold text-slate-900">{name}</h5>
        <div className="text-slate-600 text-sm space-y-2 border-t pt-3">
          <div className="flex justify-between">
            <span>Mathematics:</span>
            <span className="font-semibold">{maths} / 100</span>
          </div>
          <div className="flex justify-between">
            <span>Science:</span>
            <span className="font-semibold">{science} / 100</span>
          </div>
          <div className="flex justify-between">
            <span>Social Science:</span>
            <span className="font-semibold">{sst} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopperCard;
