/* ==========================================================================
   Perspecta — team-data.js
   Dynamic team/bio schema. Each entry maps one person to an optional
   headshot. If `photo` is omitted, or the file fails to load, the Team
   grid (see script.js -> renderTeam) automatically falls back to an
   initials avatar in brand colors — no missing-image icons.

   To add, remove, or edit a team member, just edit this array. No other
   file needs to change: the Team section on the About page (index.html,
   #team) renders this list dynamically.

   NOTE: names, roles, and bios below are placeholders tied to real,
   uploaded headshots pending confirmation of each person's preferred
   name, title, and bio text. Replace the placeholder fields before
   treating this page as final/public.
   ========================================================================== */

window.PERSPECTA_TEAM = [
  {
    id: 'jaiyeola',
    name: 'Joshua Ayomikun Jaiyeola',
    role: 'Founder — role pending confirmation',
    bio: <p>"Joshua Ayomikun Jaiyeola is a J.D. Candidate at Boston University School of Law and a summa cum laude graduate of the University of Arizona, where he earned a B.A. in Law and Political Science with an emphasis in International Relations. His interests focus on international arbitration, public international law, human rights, and international development, with a particular interest in using legal and policy frameworks to create development opportunities that are responsive to communities on the ground."<p>"His experience spans legal practice, academic research, and grassroots community work. As a Civil Division Legal Intern with the Pima County Attorney’s Office, Joshua drafted legal memoranda, analyzed litigation materials, and monitored legislation and policy developments affecting county governance. At the University of Arizona, his research experience involves examining political psychology, migration policy, FOIA requests from U.S. humanitarian parole documents, and international conflict. He has also worked with Central Washington Legal Aid, supporting families navigating housing and rental assistance and helping facilitate legal clinics."<p>"Beyond his legal and academic work, Joshua serves as Community Outreach & Engagement Coordinator for Better Future Finders, building partnerships and leading initiatives that connect underserved youth in the Yakima Valley with mentorship, resources, and community organizations. He previously helped establish Aspiring Black Lawyers to create pathways and professional opportunities for aspiring law students."<p>"Joshua founded Perspecta Human Insight with a belief that effective policy should begin not only with data and institutions, but with human insight. He hopes to help bridge rigorous research, legal analysis, and lived experience to develop practical solutions to complex global challenges.",
    photo: 'assets/team/jaiyeola.jpg'
  },
  {
    id: 'metz',
    name: 'Spencer Metz',
    role: 'Founding team — role pending confirmation',
    bio: <p>"Spencer Metz is a Master of Public Policy student at the University of Michigan's Gerald R. Ford School of Public Policy, a recipient of the Rackham Master's Award, and a 2025 PPIA Junior Summer Institute Fellow. Spencer graduated from the University of Arizona in May 2026, magna cum laude, Phi Beta Kappa, and with honors, earning a BA in Law with a minor in Economics. His thesis, “Public Perceptions of Legal Costs and Their Correlation to Prior Legal Exposure and Impact on Decision-Making,” used a survey experiment to examine perceptions of legal access and decision-making under financial constraints. Long-term, Spencer hopes to pursue a joint JD-PhD to build on this legal accessibility research and enter academia, think tanks, and policy work."<p>"This research was informed by internships at legal nonprofits, clinics, and law firms, along with a clerkship with the Red Cliff Band of Lake Superior Chippewa Tribal Court and editorial experience on the Arizona Undergraduate Law Review. Spencer also contributed to prior research in Indigenous policy with the Eller College of Management and Udall Center for Studies in Public Policy, political psychology in the Psychology of Inequality and Politics (PIP) Lab, and European Union law through the School of Government and Public Policy. Now, he serves as a member of the University of Arizona Alumni Advisory Council and as Internal Affairs Executive Director in Rackham Student Government at the University of Michigan."<p>"Outside of academics, Spencer is involved in his local Jewish community, being a regular attendee of Chabad. Born in Georgia, he has spent time in Massachusetts, Pennsylvania, Arizona, Michigan, and Delaware, where his mom and dog reside.",
    photo: 'assets/team/metz.jpg'
  },
  {
    id: 'mickelson',
    name: 'Kara Mickelson',
    role: 'Founding team — role pending confirmation',
    bio: <p>"Kara Mickelson is a graduate accounting student at George Mason University and a graduate of the University of Arizona, where she earned a B.S. in Accounting and a B.A. in Political Science with an emphasis in Law and Public Policy, along with a minor in History. Her interests lie at the intersection of accounting and government, particularly in how strong financial systems, transparency, and accountability can support effective institutions and the responsible use of public resources. She hopes to obtain her CPA license and build a career that combines her accounting background with her interest in government and public service."<p>"Kara is also a Teach For America Fellow, reflecting her passion for investing in younger generations and helping students recognize their potential. She cares deeply about mentorship, education, and creating opportunities for young people to grow in confidence and build strong foundations for their futures."<p>"Outside of her academic and professional work, Kara has spent both her undergraduate and graduate career as an NCAA Division I distance runner. At the University of Arizona, she competed in cross country and track and field, served as a team captain, and represented student-athletes through the Student-Athlete Advisory Committee. She now competes in cross country at George Mason University while continuing her graduate studies. Originally from Yakima, Washington, Kara is an avid hiker and enjoys spending as much time outdoors as possible. Her love of distance running extends beyond competition, and one of her goals after completing her NCAA eligibility is to run the Grand Canyon Rim to Rim. She hopes to continue finding challenges that combine her love of running, hiking, travel, and the outdoors long after her collegiate running career comes to an end.",
    photo: 'assets/team/mickelson.jpg'
  },
   {
    id: 'dominguez',
    name: 'Aleco Dominguez',
    role: 'Founding team — role pending confirmation',
    bio: <p>"Aleco serves on Perspecta Human Insight's board, where he leads brand strategy, digital communications, and the organization's web presence as it moves from founding idea to functioning institution."<p>"He's a Computer Science and Neuroscience & Cognitive Science double major at the University of Arizona who enjoys bridging hardware, code, and complex data. After competing internationally in triathlon for Peru, a foot stress fracture and disc injury forced him to pivot away from elite sports — he poured that same focus into research and engineering, and today splits his time analyzing RNA-sequencing data in the Julie E. Miller lab as part of the NIH-funded FUERZA cohort, writing SOPs and maintaining hardware in a nanofabrication cleanroom, and shipping full-stack projects like WhyPhy, a tool to help students find reliable campus Wi-Fi. He also manages the 2x NCAA Champion Arizona Women's Triathlon team and leads brand strategy for the Wildcat Heroes Award scholarship which inspired the Pima Heroes Award.",
    photo: 'assets/team/dominguez.jpg'
  }

  /* Example of a team member with no headshot yet — renders an
     initials-avatar fallback automatically. Just omit `photo`,
     or leave it pointing at a file that doesn't exist:

  {
    id: 'example',
    name: 'New Board Member',
    role: 'Board Member',
    bio: 'Short bio goes here.'
  }
  */

   /*
   delete this comment
   */
];
