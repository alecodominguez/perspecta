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
        role: 'Executive Director',
        bio: `<p>Joshua Ayomikun Jaiyeola is a J.D. Candidate at Boston University School of Law and a summa cum laude graduate of the University of Arizona, where he earned a B.A. in Law and Political Science with an emphasis in International Relations. His interests focus on international arbitration, public international law, human rights, and international development, with a particular interest in using legal and policy frameworks to create development opportunities that are responsive to communities on the ground.</p>
          <p>His experience spans legal practice, academic research, and grassroots community work. As a Civil Division Legal Intern with the Pima County Attorney’s Office, Joshua drafted legal memoranda, analyzed litigation materials, and monitored legislation and policy developments affecting county governance. At the University of Arizona, his research experience involves examining political psychology, migration policy, FOIA requests from U.S. humanitarian parole documents, and international conflict. He has also worked with Central Washington Legal Aid, supporting families navigating housing and rental assistance and helping facilitate legal clinics.</p>
          <p>Beyond his legal and academic work, Joshua serves as Community Outreach & Engagement Coordinator for Better Future Finders, building partnerships and leading initiatives that connect underserved youth in the Yakima Valley with mentorship, resources, and community organizations. He previously helped establish Aspiring Black Lawyers to create pathways and professional opportunities for aspiring law students.</p>
          <p>Joshua founded Perspecta Human Insight with a belief that effective policy should begin not only with data and institutions, but with human insight. He hopes to help bridge rigorous research, legal analysis, and lived experience to develop practical solutions to complex global challenges.</p>`,
        photo: 'assets/team/jaiyeola.jpg'
    },
    {
        id: 'metz',
        name: 'Spencer Metz',
        role: 'Director of Policy & Research',
        bio: `<p>Spencer Metz is a Master of Public Policy student at the University of Michigan's Gerald R. Ford School of Public Policy, a recipient of the Rackham Master's Award, and a 2025 PPIA Junior Summer Institute Fellow. Spencer graduated from the University of Arizona in May 2026, magna cum laude, Phi Beta Kappa, and with honors, earning a BA in Law with a minor in Economics. His thesis, “Public Perceptions of Legal Costs and Their Correlation to Prior Legal Exposure and Impact on Decision-Making,” used a survey experiment to examine perceptions of legal access and decision-making under financial constraints. Long-term, Spencer hopes to pursue a joint JD-PhD to build on this legal accessibility research and enter academia, think tanks, and policy work.</p>
          <p>This research was informed by internships at legal nonprofits, clinics, and law firms, along with a clerkship with the Red Cliff Band of Lake Superior Chippewa Tribal Court and editorial experience on the Arizona Undergraduate Law Review. Spencer also contributed to prior research in Indigenous policy with the Eller College of Management and Udall Center for Studies in Public Policy, political psychology in the Psychology of Inequality and Politics (PIP) Lab, and European Union law through the School of Government and Public Policy. Now, he serves as a member of the University of Arizona Alumni Advisory Council and as Internal Affairs Executive Director in Rackham Student Government at the University of Michigan.</p>
          <p>Outside of academics, Spencer is involved in his local Jewish community, being a regular attendee of Chabad. Born in Georgia, he has spent time in Massachusetts, Pennsylvania, Arizona, Michigan, and Delaware, where his mom and dog reside.</p>`,
        photo: 'assets/team/metz.jpg'
    },
    {
        id: 'mickelson',
        name: 'Kara Mickelson',
        role: 'Director of Finance & Fundraising',
        bio: `<p>Kara Mickelson is a graduate accounting student at George Mason University and a graduate of the University of Arizona, where she earned a B.S. in Accounting and a B.A. in Political Science with an emphasis in Law and Public Policy, along with a minor in History. Her interests lie at the intersection of accounting and government, particularly in how strong financial systems, transparency, and accountability can support effective institutions and the responsible use of public resources. She hopes to obtain her CPA license and build a career that combines her accounting background with her interest in government and public service.</p>
          <p>Kara is also a Teach For America Fellow, reflecting her passion for investing in younger generations and helping students recognize their potential. She cares deeply about mentorship, education, and creating opportunities for young people to grow in confidence and build strong foundations for their futures.</p>
          <p>Outside of her academic and professional work, Kara has spent both her undergraduate and graduate career as an NCAA Division I distance runner. At the University of Arizona, she competed in cross country and track and field, served as a team captain, and represented student-athletes through the Student-Athlete Advisory Committee. She now competes in cross country at George Mason University while continuing her graduate studies. Originally from Yakima, Washington, Kara is an avid hiker and enjoys spending as much time outdoors as possible. Her love of distance running extends beyond competition, and one of her goals after completing her NCAA eligibility is to run the Grand Canyon Rim to Rim. She hopes to continue finding challenges that combine her love of running, hiking, travel, and the outdoors long after her collegiate running career comes to an end.</p>`,
        photo: 'assets/team/mickelson.jpg'
    },
    {
        id: 'dominguez',
        name: 'Aleco Dominguez',
        role: 'Director of Digital Infrastructure',
        bio: `<p>Aleco serves on Perspecta Human Insight's board, where he leads brand strategy, digital communications, and the organization's web presence as it moves from founding idea to functioning institution.</p>
          <p>He's a Computer Science and Neuroscience & Cognitive Science double major at the University of Arizona who enjoys bridging hardware, code, and complex data. After competing internationally in triathlon for Peru, a foot stress fracture and disc injury forced him to pivot away from elite sports — he poured that same focus into research and engineering, and today splits his time analyzing RNA-sequencing data in the Julie E. Miller lab as part of the NIH-funded FUERZA cohort, writing SOPs and maintaining hardware in a nanofabrication cleanroom, and shipping full-stack projects like WhyPhy, a tool to help students find reliable campus Wi-Fi. He also manages the 2x NCAA Champion Arizona Women's Triathlon team and leads brand strategy for the Wildcat Heroes Award scholarship which inspired the Pima Heroes Award.</p>`,
        photo: 'assets/team/dominguez.jpg'
    },
    {
        id: 'vaishnav',
        name: 'Priyanshu (Pri) Vaishnav',
        role: 'Director of Digital Infrastructure',
        bio: `<p>Priyanshu “Pri” Vaishnav is an MSc candidate in Political Science and Political Economy at the London School of Economics. He studied at the University of California, Santa Barbara, where he earned a B.A. in Political Science with an emphasis in International Relations. His interests sit where politics and finance overlap, and he usually comes at both through history. He wants to understand how governments regulate markets and how economic pressure moves political outcomes. Old decisions matter here too, because many of today’s institutions still run on choices made decades ago. What interests him most is the rulebook for markets and the agencies that write and enforce it. After LSE, he plans to earn a J.D. and work in U.S. federal regulatory law. His long-term goal is to work on policy that keeps financial and governmental systems accountable to the public.</p>
<p>His work so far has split between government and research. He has worked in both chambers of the U.S. Congress, the Senate and the House of Representatives. There he saw how a constituent’s concern becomes committee work and, eventually, legislation. He has also worked more broadly in the U.S. defense sector. At UCSB he was a Research Assistant to Professor Brent Strathman, and the two co-authored a 70,000-word paper on the Gang of Eight. This is the small group of congressional leaders briefed on the country’s most sensitive intelligence matters. The paper looks at how Congress oversees the intelligence community and where that oversight falls short.</p>
<p>Model UN got him interested in international affairs and negotiation at UCSB. Investment Connection gave him hands-on work with markets and financial analysis. He also joined the Pre-Law Society to prepare for a legal career.</p>
<p>Pri grew up in San Diego and now lives in London. Hindi is his heritage language, and he is still building his reading and writing in it. He swims and plays water polo. On land, it’s tennis. He gets outdoors whenever he can, mostly to hike and rock climb, and he travels as often as his schedule allows. In motorsport he follows F1 and the World Endurance Championship. He watches baseball too. He also watches films closely, Christopher Nolan’s in particular.</p>`,
        photo: 'assets/team/vaishnav.jpg'
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
