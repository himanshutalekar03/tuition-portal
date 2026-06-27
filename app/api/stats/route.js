import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import ClassModel from "@/models/Class";
import Subject from "@/models/Subject";
import Fee from "@/models/Fee";
import Attendance from "@/models/Attendance";
import Result from "@/models/Result";

export async function GET() {
  try {
    await connectDB();

    const studentsCount = await User.countDocuments({ role: "student" });
    const teachersCount = await User.countDocuments({ role: "teacher" });
    const classesCount = await ClassModel.countDocuments();
    const subjectsCount = await Subject.countDocuments();

    // Calculate Fees
    const fees = await Fee.find({});
    let totalExpected = 0;
    let totalCollected = 0;
    fees.forEach(fee => {
      totalExpected += fee.amountTotal || 0;
      totalCollected += fee.amountPaid || 0;
    });

    // Calculate Attendance %
    const totalRecords = await Attendance.countDocuments();
    const presentRecords = await Attendance.countDocuments({ status: "Present" });
    const attendancePercentage = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(1) : 0;

    // Calculate Top Performers
    // Group by student, average marks
    const results = await Result.aggregate([
      {
        $group: {
          _id: "$student",
          totalMarksObtained: { $sum: "$marksObtained" },
          totalMarksPossible: { $sum: "$totalMarks" }
        }
      },
      {
        $project: {
          percentage: {
            $cond: [
              { $gt: ["$totalMarksPossible", 0] },
              { $multiply: [{ $divide: ["$totalMarksObtained", "$totalMarksPossible"] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { percentage: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" }
    ]);

    const topPerformers = results.map(r => ({
      id: r._id,
      name: r.studentInfo.name,
      percentage: r.percentage.toFixed(1)
    }));

    return new Response(
      JSON.stringify({
        students: studentsCount,
        teachers: teachersCount,
        classes: classesCount,
        subjects: subjectsCount,
        fees: {
          expected: totalExpected,
          collected: totalCollected
        },
        attendancePercentage,
        topPerformers
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
    });
  }
}
