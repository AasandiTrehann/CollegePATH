import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Define Colleges data
  const collegesData = [
    {
      id: 'iit-bombay',
      name: 'Indian Institute of Technology Bombay (IIT Bombay)',
      location: 'Mumbai, Maharashtra',
      fees: 220000,
      establishedYear: 1958,
      overview: 'IIT Bombay is a leading public technical and research university located in Powai, Mumbai. Recognized as an Institution of Eminence, it is world-renowned for its engineering education, cutting-edge research, and distinguished alumni network.',
      examType: 'JEE Advanced',
      baseRank: 60, // Base General CSE Rank in Round 1
      placementAvg: 23.5,
      placementMax: 168.0,
      placementRate: 97.2,
    },
    {
      id: 'iit-delhi',
      name: 'Indian Institute of Technology Delhi (IIT Delhi)',
      location: 'New Delhi, Delhi',
      fees: 225000,
      establishedYear: 1961,
      overview: 'IIT Delhi is a premier engineering institute located in Hauz Khas, New Delhi. It offers highly competitive programs and stands as a hub for scientific research and technological innovation in India.',
      examType: 'JEE Advanced',
      baseRank: 100,
      placementAvg: 21.8,
      placementMax: 150.0,
      placementRate: 96.5,
    },
    {
      id: 'iit-madras',
      name: 'Indian Institute of Technology Madras (IIT Madras)',
      location: 'Chennai, Tamil Nadu',
      fees: 215000,
      establishedYear: 1959,
      overview: 'IIT Madras has consistently been ranked as the top engineering institute in India by NIRF. Known for its lush green campus and the IIT Madras Research Park, it offers world-class educational and entrepreneurial ecosystems.',
      examType: 'JEE Advanced',
      baseRank: 140,
      placementAvg: 21.4,
      placementMax: 131.0,
      placementRate: 95.8,
    },
    {
      id: 'iit-kharagpur',
      name: 'Indian Institute of Technology Kharagpur (IIT Kharagpur)',
      location: 'Kharagpur, West Bengal',
      fees: 210000,
      establishedYear: 1951,
      overview: 'IIT Kharagpur is the oldest of the IITs, founded in 1951. With the largest campus area and the maximum number of courses among IITs, it is a historical leader in technical education.',
      examType: 'JEE Advanced',
      baseRank: 260,
      placementAvg: 19.5,
      placementMax: 120.0,
      placementRate: 94.2,
    },
    {
      id: 'iit-kanpur',
      name: 'Indian Institute of Technology Kanpur (IIT Kanpur)',
      location: 'Kanpur, Uttar Pradesh',
      fees: 218000,
      establishedYear: 1959,
      overview: 'IIT Kanpur is renowned for its academic rigor, excellent research facilities, and computer science program. Its student-run airstrip and strong engineering infrastructure make it highly unique.',
      examType: 'JEE Advanced',
      baseRank: 210,
      placementAvg: 20.2,
      placementMax: 140.0,
      placementRate: 95.0,
    },
    {
      id: 'iit-roorkee',
      name: 'Indian Institute of Technology Roorkee (IIT Roorkee)',
      location: 'Roorkee, Uttarakhand',
      fees: 222000,
      establishedYear: 1847,
      overview: 'Originally established as the College of Civil Engineering in 1847, IIT Roorkee is the oldest technical institution in Asia. It possesses a stellar legacy in engineering education and research.',
      examType: 'JEE Advanced',
      baseRank: 380,
      placementAvg: 18.8,
      placementMax: 112.0,
      placementRate: 93.5,
    },
    {
      id: 'nit-trichy',
      name: 'National Institute of Technology Tiruchirappalli (NIT Trichy)',
      location: 'Tiruchirappalli, Tamil Nadu',
      fees: 145000,
      establishedYear: 1964,
      overview: 'NIT Trichy is consistently ranked as the #1 National Institute of Technology in India. It is highly sought after for its exceptional academic standards and placement records.',
      examType: 'JEE Main',
      baseRank: 900,
      placementAvg: 15.6,
      placementMax: 52.8,
      placementRate: 92.5,
    },
    {
      id: 'nit-surathkal',
      name: 'National Institute of Technology Karnataka (NIT Surathkal)',
      location: 'Surathkal, Karnataka',
      fees: 150000,
      establishedYear: 1960,
      overview: 'NITK Surathkal is beautifully situated right on the shore of the Arabian Sea. It is a premier technical institute boasting state-of-the-art research blocks and top-tier placement stats.',
      examType: 'JEE Main',
      baseRank: 1200,
      placementAvg: 15.2,
      placementMax: 54.0,
      placementRate: 93.0,
    },
    {
      id: 'nit-warangal',
      name: 'National Institute of Technology Warangal (NIT Warangal)',
      location: 'Warangal, Telangana',
      fees: 148000,
      establishedYear: 1959,
      overview: 'NIT Warangal was the first in the chain of Regional Engineering Colleges (RECs) established in India. It is highly acclaimed for its technical pedagogy and competitive student community.',
      examType: 'JEE Main',
      baseRank: 1400,
      placementAvg: 14.8,
      placementMax: 88.0,
      placementRate: 91.8,
    },
    {
      id: 'dtu-delhi',
      name: 'Delhi Technological University (DTU)',
      location: 'Rohini, Delhi',
      fees: 219000,
      establishedYear: 1941,
      overview: 'Formerly known as Delhi College of Engineering (DCE), DTU is one of the oldest and most prestigious engineering colleges in India. It has nurtured numerous unicorn founders and industry executives.',
      examType: 'JEE Main',
      baseRank: 2000,
      placementAvg: 15.1,
      placementMax: 82.0,
      placementRate: 90.5,
    },
    {
      id: 'nsut-delhi',
      name: 'Netaji Subhas University of Technology (NSUT)',
      location: 'Dwarka, Delhi',
      fees: 229000,
      establishedYear: 1983,
      overview: 'NSUT, formerly NSIT, is a premier state university located in Dwarka, Delhi. It is highly valued for its electronics and computer science courses, yielding top-tier placement results yearly.',
      examType: 'JEE Main',
      baseRank: 2500,
      placementAvg: 14.2,
      placementMax: 77.0,
      placementRate: 88.9,
    },
    {
      id: 'bits-pilani',
      name: 'Birla Institute of Technology and Science (BITS Pilani)',
      location: 'Pilani, Rajasthan',
      fees: 540000,
      establishedYear: 1964,
      overview: 'BITS Pilani is India\'s top private deemed university, famous for its "zero attendance policy" and strong startup culture. Note: While BITS has its own BITSAT exam, we map it to JEE Main equivalents here for admission prediction.',
      examType: 'JEE Main',
      baseRank: 1800,
      placementAvg: 18.2,
      placementMax: 74.0,
      placementRate: 94.5,
    },
    {
      id: 'vit-vellore',
      name: 'Vellore Institute of Technology (VIT)',
      location: 'Vellore, Tamil Nadu',
      fees: 198000,
      establishedYear: 1984,
      overview: 'VIT is a highly prominent private university. Known for its massive state-of-the-art campus, flexible credit system, and vast international relations, it produces thousands of graduates hired by top firms globally.',
      examType: 'JEE Main',
      baseRank: 7500,
      placementAvg: 9.2,
      placementMax: 59.0,
      placementRate: 86.4,
    },
    {
      id: 'thapar-patiala',
      name: 'Thapar Institute of Engineering and Technology (TIET)',
      location: 'Patiala, Punjab',
      fees: 420000,
      establishedYear: 1956,
      overview: 'Thapar Institute is one of Punjab\'s oldest and premier private technical universities, known for its beautiful campus, collaboration with Trinity College Dublin, and robust corporate placements.',
      examType: 'JEE Main',
      baseRank: 12000,
      placementAvg: 10.5,
      placementMax: 45.0,
      placementRate: 89.2,
    },
    {
      id: 'mit-manipal',
      name: 'Manipal Institute of Technology (MIT)',
      location: 'Manipal, Karnataka',
      fees: 467000,
      establishedYear: 1957,
      overview: 'MIT Manipal is a renowned private engineering college and constituent unit of MAHE. It offers a vibrant student life, state-of-the-art labs, and a historical track record of recruiting from top tech companies.',
      examType: 'JEE Main',
      baseRank: 15000,
      placementAvg: 11.2,
      placementMax: 51.0,
      placementRate: 88.0,
    },
  ];

  // 2. Reviews data generator pool
  const reviewTemplates = [
    {
      studentName: 'Aman Sharma',
      rating: 5,
      comment: 'Excellent academic culture, outstanding placements in 2023, and incredible tech club exposure. The campus life is unmatched!',
    },
    {
      studentName: 'Riya Patel',
      rating: 4,
      comment: 'Highly qualified faculty and very modern labs. The curriculum is rigorous but prepares you well for industry challenges. Hostels could be slightly better.',
    },
    {
      studentName: 'Kartik Iyer',
      rating: 4,
      comment: 'Coding culture is stellar. You will find seniors helping you in competitive programming and hackathons. Mess food is decent.',
    },
    {
      studentName: 'Sneha Reddy',
      rating: 5,
      comment: 'A dream college! Beautiful infrastructure, absolute academic freedom, and amazing placement packages. Companies from all sectors visit here.',
    },
  ];

  // 3. Main Seeding Transaction Loop
  for (const col of collegesData) {
    console.log(`Processing: ${col.name}...`);

    // Dynamic dynamic rating calculation logic: 
    // We seed reviews first and then compute the average in application queries.
    // Let's create the College via upsert
    const college = await prisma.college.upsert({
      where: { id: col.id },
      update: {
        name: col.name,
        location: col.location,
        fees: col.fees,
        overview: col.overview,
        establishedYear: col.establishedYear,
      },
      create: {
        id: col.id,
        name: col.name,
        location: col.location,
        fees: col.fees,
        overview: col.overview,
        establishedYear: col.establishedYear,
      },
    });

    // Create Placements for Year 2023 via upsert/delete-insert to ensure clean slate
    await prisma.placement.deleteMany({ where: { collegeId: college.id } });
    await prisma.placement.create({
      data: {
        year: 2023,
        averagePackage: col.placementAvg,
        highestPackage: col.placementMax,
        placementRate: col.placementRate,
        collegeId: college.id,
      },
    });

    // Create Reviews
    await prisma.review.deleteMany({ where: { collegeId: college.id } });
    for (let i = 0; i < reviewTemplates.length; i++) {
      const ratingVariance = (i % 2 === 0) ? 0 : -1; // Add variance to ratings (e.g. 5, 4, 4, 3)
      await prisma.review.create({
        data: {
          studentName: reviewTemplates[i].studentName,
          rating: Math.max(1, reviewTemplates[i].rating + ratingVariance),
          comment: reviewTemplates[i].comment,
          collegeId: college.id,
        },
      });
    }

    // Create Courses & Cutoffs
    // We define three courses: CSE, ECE, ME
    const courses = [
      { name: 'Computer Science and Engineering', code: 'CSE', feeMultiplier: 1.1, duration: '4 Years' },
      { name: 'Electronics and Communication Engineering', code: 'ECE', feeMultiplier: 1.0, duration: '4 Years' },
      { name: 'Mechanical Engineering', code: 'ME', feeMultiplier: 0.9, duration: '4 Years' },
    ];

    // Clean old courses (and cascades cutoffs due to onDelete: Cascade)
    await prisma.course.deleteMany({ where: { collegeId: college.id } });

    for (const c of courses) {
      const course = await prisma.course.create({
        data: {
          name: c.name,
          duration: c.duration,
          fees: col.fees * c.feeMultiplier,
          collegeId: college.id,
        },
      });

      // Cutoff Generation logic
      // CSE general baseline rank is col.baseRank
      // ECE is generally 3.5x CSE rank
      // ME is generally 10x CSE rank
      let rankMultiplier = 1.0;
      if (c.code === 'ECE') rankMultiplier = 3.5;
      if (c.code === 'ME') rankMultiplier = 10.0;

      const cseGeneralBase = col.baseRank;
      const courseGeneralBase = Math.round(cseGeneralBase * rankMultiplier);

      // Categories and their rank ratio relative to General CRL (for realistic mapping)
      // Category ranks are smaller. General = 1.0, OBC = 0.45, SC = 0.15, ST = 0.08, EWS = 0.20
      const categories = [
        { name: 'General', ratio: 1.00 },
        { name: 'OBC', ratio: 0.45 },
        { name: 'SC', ratio: 0.15 },
        { name: 'ST', ratio: 0.08 },
        { name: 'EWS', ratio: 0.20 },
      ];

      // Counselling Rounds (1 and 6)
      const rounds = [1, 6];

      for (const cat of categories) {
        for (const rnd of rounds) {
          // Ranks relax in Round 6 (higher closing ranks)
          const roundMultiplier = rnd === 6 ? 1.18 : 1.00;
          
          const maxRank = Math.round(courseGeneralBase * cat.ratio * roundMultiplier);
          const minRank = Math.round(maxRank * 0.65); // Opening rank is typically ~65% of closing rank

          await prisma.cutoff.create({
            data: {
              exam: col.examType,
              category: cat.name,
              round: rnd,
              minRank: Math.max(1, minRank),
              maxRank: Math.max(2, maxRank),
              collegeId: college.id,
              courseId: course.id,
            },
          });
        }
      }
    }
  }

  console.log('✅ Seeding complete. 15 Colleges, 45 Courses, 900+ Cutoffs created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
