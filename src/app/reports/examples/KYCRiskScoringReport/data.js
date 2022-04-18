export default {
  company: {
    id: 2,
    createdAt: "2020-11-25T05:03:14.830+00:00",
    updatedAt: "2021-01-20T10:19:14.817+00:00",
    createdBy: {
      id: 1,
      firstName: "Admin",
      lastName: "4",
      email: "admin@regtank.com",
      colorCode: null,
      avatar: null,
    },
    lastModifiedBy: {
      id: 1,
      firstName: "Admin",
      lastName: "4",
      email: "admin@regtank.com",
      colorCode: null,
      avatar: null,
    },
    company: "Regtank UAT",
    paymentFrequency: "ANNUAL",
    usedPackage: {
      id: 1,
      name: "Basic package",
      description: "Basic package for testing",
      kycCost: 3,
      kytCost: 2,
      monthly: {
        price: 999,
        credits: 1000,
      },
      quarterly: {
        price: 999,
        credits: 3000,
      },
      biAnnual: {
        price: 999,
        credits: 5000,
      },
      annual: {
        price: 999,
        credits: 10000,
      },
      isCurrent: false,
      usedPackagePeriod: null,
    },
  },
  printedBy: {
    id: 7,
    createdAt: "2020-11-25T03:26:24.212+00:00",
    updatedAt: "2021-05-12T10:23:07.239+00:00",
    createdBy: null,
    lastModifiedBy: {
      id: 1,
      firstName: "Admin",
      lastName: "4",
      email: "admin@regtank.com",
      colorCode: null,
      avatar: null,
    },
    firstName: "Thor",
    lastName: "1",
    colorCode: null,
    avatar: null,
    address: "string",
    email: "dummy@email.com",
    bio: "string",
    phone: "0123456789",
    role: "ADMIN",
    locked: false,
    lastAccessed: "2021-05-12T10:23:07.226+00:00",
    verified: false,
    fullName: "Thor 1",
  },
  riskScoring: {
    request: {
      id: 33,
      createdAt: "2021-04-22T10:04:58.459+00:00",
      updatedAt: "2021-04-22T10:04:58.459+00:00",
      createdBy: {
        id: 3,
        firstName: "Admin",
        lastName: "2",
        email: "admin@regtank.com",
        colorCode: "#8CC44A",
        avatar: null,
      },
      lastModifiedBy: {
        id: 3,
        firstName: "Admin",
        lastName: "2",
        email: "admin@regtank.com",
        colorCode: "#8CC44A",
        avatar: null,
      },
      name: "xcv naem",
      forename: "xcv",
      middlename: null,
      surname: "naem",
      gender: null,
      email: null,
      phone: null,
      address1: null,
      address2: null,
      dateOfBirth: null,
      yearOfBirth: null,
      placeOfBirth: null,
      nationality: null,
      countryOfResidence: null,
      governmentIdNumber: null,
      idIssuingCountry: null,
      referenceId: null,
      enableReScreening: true,
      reScreeningEditable: true,
    },
    scoring: {
      id: 5,
      createdAt: "2021-04-27T07:17:32.737+00:00",
      updatedAt: "2021-04-27T07:30:01.258+00:00",
      createdBy: null,
      lastModifiedBy: null,
      risk: 121.2,
      riskLevel: "MEDIUM",
      sanctionedPersonOrCountry: {
        info: false,
        score: 0,
      },
      pep: {
        info: 0,
        score: 0,
      },
      previouslySanctionedPerson: {
        info: false,
        score: 0,
      },
      financialRegulator: {
        info: false,
        score: 0,
      },
      lawEnforcement: {
        info: false,
        score: 0,
      },
      adverseMedia: {
        info: false,
        score: 0,
      },
      countryOfResidence: {
        fatf: {
          info: null,
          score: 10,
        },
        basel: {
          info: null,
          score: 20,
        },
        cpi: {
          info: null,
          score: 20,
        },
      },
      idIssuingCountry: {
        fatf: {
          info: null,
          score: 10,
        },
        basel: {
          info: null,
          score: 20,
        },
        cpi: {
          info: null,
          score: 20,
        },
      },
      nationality: {
        fatf: {
          info: null,
          score: 10,
        },
        basel: {
          info: null,
          score: 20,
        },
        cpi: {
          info: null,
          score: 20,
        },
      },
      settingId: 7,
      scoringId: 1,
      changeHistory: [
        {
          id: 4,
          createdAt: "2021-04-27T07:30:01.186+00:00",
          updatedAt: "2021-04-27T07:30:01.186+00:00",
          createdBy: {
            id: 7,
            firstName: "Thor",
            lastName: "1",
            email: "dummy@email.com",
            colorCode: null,
            avatar: null,
          },
          lastModifiedBy: {
            id: 7,
            firstName: "Thor",
            lastName: "1",
            email: "dummy@email.com",
            colorCode: null,
            avatar: null,
          },
          previousScore: 240.71,
          newScore: 1212.71,
          note: "12121",
          previousScoreRiskLevel: "HIGH",
          newScoreRiskLevel: "MEDIUM",
          reScreeningPeriod: 3,
        },
      ],
      numberOfChanges: 1,
      reScreeningPeriod: 3,
    },
    kycId: "KYC00033",
    assignee: {
      id: 7,
      firstName: "Thor",
      lastName: "1",
      email: "dummy@email.com",
      colorCode: null,
      avatar: null,
    },
    kycBlacklistMatches: [
      {
        id: 3,
        createdAt: "2021-09-13T07:06:31.051+00:00",
        updatedAt: "2021-09-13T07:23:08.587+00:00",
        createdBy: {
          id: 5,
          firstName: "JordanCompanyAdmin",
          lastName: "",
          email: "jordan@islandpeakcloud.sg",
          colorCode: "#607D8B",
          avatar: null,
        },
        lastModifiedBy: {
          id: 5,
          firstName: "JordanCompanyAdmin",
          lastName: "",
          email: "jordan@islandpeakcloud.sg",
          colorCode: "#607D8B",
          avatar: null,
        },
        kycRequest: {
          id: 61,
          createdAt: "2021-09-13T06:45:17.501+00:00",
          updatedAt: "2021-09-13T07:38:59.976+00:00",
          messageStatus: "DONE",
          clientType: "USER",
          kycId: "KYC00061",
          individualRequest: {
            id: 61,
            createdAt: "2021-09-13T06:45:17.488+00:00",
            updatedAt: "2021-09-13T06:49:33.795+00:00",
            forename: "Edin",
            middlename: null,
            surname: "Dzeko",
            gender: "MALE",
            email: null,
            phone: null,
            address1: null,
            address2: null,
            dateOfBirth: null,
            yearOfBirth: null,
            placeOfBirth: null,
            nationality: null,
            countryOfResidence: null,
            governmentIdNumber: null,
            idIssuingCountry: null,
            referenceId: null,
            enableReScreening: false,
            enableOnGoingMonitoring: true,
            assignee: null,
            name: "Edin Dzeko",
            pep: true,
            currentSanctions: true,
            financialRegulator: true,
            lawEnforcement: true,
            adverseMedia: true,
            omStartPeriod: null,
            reScreeningEditable: true,
          },
          enableReScreening: false,
          type: "INDIVIDUAL",
          lastScreenedAt: "2021-09-13T07:38:59.448+00:00",
          status: "COMPLETED",
          referenceId: null,
          individualPositiveMatch: {
            id: 977,
            createdAt: "2021-09-13T06:45:21.242+00:00",
            updatedAt: "2021-09-13T08:04:53.476+00:00",
            matchId: "M01",
            keyData: {
              aliases: [
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Dzeka",
                },
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Džeko",
                },
              ],
              email: "",
              telephone: "",
              website: null,
              addresses: [
                "Everett, Washington, United States of America",
                "Drugovici, Gacko, Bosnia and Herzegovina",
                "Trusina, Bosnia and Herzegovina",
                "Jablanica, Bosnia and Herzegovina",
              ],
            },
            furtherInformation: {
              politicalPositions: [],
              notes: [
                "Reputational Risk Exposure",
                "Regulatory Enforcement Lists",
              ],
            },
            sources: [
              {
                originalUrl: "http://www.bim.ba/en/204/10/25556/",
                c6Url: "",
                keywords: ["PEP", "AM"],
                creationDate: "2010-02-09T00:00:00.000+00:00",
                title: null,
                summary:
                  "Rasema Handanovic and Edin Dzeka, suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26556/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title:
                  "Hodzic et al: Another Indictment for Trusina Crimes Filed",
                summary:
                  "Rasema Handanovic and Edin Dzeka, who are suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26549/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title: "Indictment for Trusina Crimes Confirmed",
                summary:
                  '12 March 2010 The Court of Bosnia and Herzegovina has confirmed an indictment against three former members of the Army of Bosnia and Herzegovina accused of participating in crimes against Croats in Trusina village in Herzegovina in April 1993. The indictment alleges that on that day Memic, Nedzad Hodzic, Rasema Handanovic, known as Zolja, and other members of the "Zulfikar" Squad participated in the shooting of HVO members in Gaj hamlet. The indictment further alleges that Nedzad Hodzic issued the order for the shooting.',
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.croatiantimes.com/news/General_News/2011-04-14/18582/Two_arrested_in_US_for_war_crimes_against_Bosnian_Croats",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2011-04-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "The 39-year-old Edin Dzeko and 38-year-old Rasema Handanovic were arrested in the states of Washington and Oregon, respectively, on an international warrant issued by Bosnia and Herzegovina. Dzeko was living in the city of Everett, Washington while Handanovic was in Portland, Oregon where she was arrested, the daily Jutarnji List.",
                keywordsMatched: ["arrested", "warrant"],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2306&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019800000/0019799742.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1304&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019805000/0019801368.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2511&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020107251.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1480&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020108485.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2532&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020125000/0020122720.pdf",
                keywords: ["LF"],
                creationDate: "2012-07-26T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2553&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020140000/0020138718.pdf",
                keywords: ["LF"],
                creationDate: "2012-08-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/witness-claims-edin-dzeko-killed-civilians",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-09-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Handanovic, a former member of the Zulifkar special purposes detachment of the Army of Bosnia and Herzegovina, said that Dzeko was a member of her unit and killed the couple with a burst of fire from an automatic rifle. Dzeko's lawyer, Vasvija Vidovic, claimed during cross examination that the killing of the elderly couple was in fact done by Handanovic. The indictment says Dzeko killed two elderly women and one man during the attack in Trusina. Handanovic has admitted guilt for shooting several civilians and for imprisoning members of the Croatian Defence Forces, HVO, a crime Dzeko is also charged with taking part in. After describing how Dzeko killed the elderly couple during the initial attack on Trusina, Handanovic said that members of the Zulfikar unit headed back to Gaj, where she saw six or seven men in civilian clothes and uniforms lined up in front of a barn. Nedzad yelled to shoot and we shot,” the witness said, adding that Dzeko was among those to fire.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-was-in-trusina-during-the-attack-says-witness",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-10-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "At the trial of Edin Dzeko, a prosecution witness says he saw the defendant during the attack on the village of Trusina in 1993, but that he did not witness any murders.",
                keywordsMatched: ["prosecution"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-granted-release-from-custody",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-05-31T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko, accused of killing and illegally detaining Croats during the 1990s conflict, has been released on bail in the midst of his trial. The Bosnian court on Thursday decided to release Dzeko from custody after he put up around 300,000 euro of property as security against potential abscondment. Dzeko, a former Bosnian Army serviceman, is charged with participating in the execution of several Croatian Defence Council soldiers and Croat civilians in the village of Trusina near the southern Bosnian town of Konjic, and participating in the illegal arrest of nine civilians in Jablanica. The court released Dzeko after he offered the financial guarantee but banned him from leaving his place of residence, temporarily confiscated his passport and said that he was barred from using his personal ID to cross state borders. After the war, Dzeko emigrated to the US, but the American authorities extradited him to Bosnia in December 2011. Bosnian Fighter Dzeko Released From Custody Stanisic and Simatovic, Belgrade's Security Strongmen Kosovo Guerrilla Trial Witness Slams EU Prosecutor",
                keywordsMatched: [
                  "illegal",
                  "confiscated",
                  "arrest",
                  "illegally",
                  "charged with",
                ],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2807&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020355000/0020351000.pdf",
                keywords: ["LF"],
                creationDate: "2013-06-03T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/beginning-of-zenica-crimes-trial",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-09-02T00:00:00.000+00:00",
                title: "Beginning of Zenica Crimes Trial",
                summary:
                  "com, including premium articles, full audio, video and documents Register for free On Tuesday, September 3 the Defence of Edin Dzeko, who is charged with crimes in Jablanica, will examine a protected witness.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/closing-arguments-in-three-trials-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-22T00:00:00.000+00:00",
                title: "Closing Arguments in Three Trials Next Week",
                summary:
                  "On Tuesday, new Defence witnesses will testify at the trials of Edin Dzeko for crimes in Trusina and Jablanica, and Predrag Milisavljevic, Milos Pantelic and Ljubomir Tasic for crimes in Visegrad.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/appeals-against-basic-and-sijak-verdicts-due-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-28T00:00:00.000+00:00",
                title: "Appeals against Basic and Sijak Verdicts Due Next Week",
                summary:
                  "On that same day the trials are due to continue in the case against Najdan Mladjenovic and Savo Zivkovic for crimes in Bratunac, Edin Dzeko for crimes in Trusina and Jablanica, as well as Ivan Zelenika, Srecko Herceg, Edib Buljubasic, Ivan Medic and Marina Grubisic-Fejzic, who are charged with crimes in Dretelj.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/witness-says-he-is-not-capable-of-testifying",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-11-28T00:00:00.000+00:00",
                title: "Witness Says He is not Capable of Testifying",
                summary:
                  "This witness was due to testify in defence of indictee Dzeko, former member of “Zulfikar” Squad with the Army of Bosnia and Herzegovina, ABiH. Vasvija Vidovic, Defence attorney of indictee Dzeko, said that she stuck to her request for examination of this witness. “We would not insist of examining him, if he were not the direct eyewitness of the event charged upon Dzeko,” Vidovic said, adding that, in his previous statements the witness did not mention that he was not capable of testifying. Dzeko is on trial for committing murders of Croats in Trusina on April 16, 1993. The trial is due to continue on December 10, when indictee Dzeko will testify in his defence.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-says-he-s-not-murderer",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-12-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko told his own trial that witnesses who said he took part in the execution of several Croats in the village of Trusina near Konjic in 1993 were lying. Dzeko, a former member of the Bosnian Army's Zulfikar detachment, is charged with taking part in the execution of civilians and imprisoned fighters from the Croatian Defence Council, along with other members of his unit, on April 16, 1993. According to Dzeko, Bosnian Army troops went into action on the morning of April 16 after their foes opened fire first.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/seven-indictees-due-to-enter-pleas-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-02-17T00:00:00.000+00:00",
                title: null,
                summary:
                  "The source contains media information about the subject.",
                keywordsMatched: [""],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3161&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020505000/0020500489.pdf",
                keywords: ["LF"],
                creationDate: "2014-03-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3191&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020510000/0020509785.pdf",
                keywords: ["LF"],
                creationDate: "2014-04-07T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-sentenced-to-12-years-in-prison",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-06-30T00:00:00.000+00:00",
                title:
                  "osniak Soldier Jailed for Killing Croats in Trusina :: Balkan Insight",
                summary:
                  "The court in Sarajevo on Friday convicted Dzeko, a former member of the Bosnian Army's Zulfikar Squad, of involvement in the execution of six Croatian Defence Council fighters and the murder of a married couple during an attack on Trusina on April 16, 1993. He cited the testimony of one prosecution witness, Rasema Handanovic, a former member of the Zulfikar Squad who was also jailed for crimes committed during the Trusina attack who said that she saw the Dzeko during the execution. “Rasema Handanovic said that Dzeko was standing at her right side when the shooting began,” he said. The court did not accept the prosecution's claim that the fighters who were killed were civilians, or the claim that Dzeko could not have participated in the execution because he had driven some of his wounded comrades out of Trusina before it happened. “The chamber established that he participated in the transportation of the wounded, but that he was also present during the very act of the execution,” Maksumic said. Dzeko was also sentenced to seven years in prison for killing married couple Ilija and Andja Ivankovic in Trusina, and the court ordered a combined sentence of 12 years for both convictions. However Dzeko was acquitted of the illegal arrest and detention of Croatian civilians at the Zulfikar Squad's base in Donja Jablanica in September 1993, as well as beatings and looting in the town of Jablanica in the second half of 1993. The judge explained that Dzeko, as an ordinary soldier, was obeying orders given by a military police officer who had the list of people to be arrested. Dzeko was also acquitted of taking money from victims and of ordering three other soldiers to beat a man with wooden bars and concrete blocks. The fact that Dzeko has a family, that he was young when the crime was committed and that he acted correctly during the trial was taken into account by the court as mitigating circumstances. His trial started in 2012 after he was extradited from the United States the previous year.",
                keywordsMatched: [
                  "jailed",
                  "sentence",
                  "detention",
                  "arrested",
                  "arrest",
                  "prosecution",
                  "illegal",
                ],
              },
            ],
            connections: [
              {
                name: "Sefer Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "149737",
              },
              {
                name: "Rasim Delic",
                association: "Army of Bosnia and Herzegovina",
                personId: "560798",
              },
              {
                name: "Suad Kapic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2342755",
              },
              {
                name: "Emir Mustafic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2369881",
              },
              {
                name: "Adil Ruznic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2390959",
              },
              {
                name: "Nihad Bojadzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3088090",
              },
              {
                name: "Mehura Selimovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189355",
              },
              {
                name: "Alija Osmic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189403",
              },
              {
                name: "Senad Hakalovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189563",
              },
              {
                name: "Nedzad Hodzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189565",
              },
              {
                name: "Mensur Memic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189568",
              },
              {
                name: "Dzevad Salcin",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189575",
              },
              {
                name: "Zulfikar Alispago",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189583",
              },
              {
                name: "Rasema Handanovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189585",
              },
              {
                name: "Eso Macic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3392995",
              },
              {
                name: "Osman Sego",
                association: "Army of Bosnia and Herzegovina",
                personId: "3396470",
              },
              {
                name: "Nezir Kazic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3707226",
              },
              {
                name: "Azemin Sadikovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3914281",
              },
              {
                name: "Osman Brkan",
                association: "Army of Bosnia and Herzegovina",
                personId: "3962603",
              },
              {
                name: "Vehid Subotic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4018155",
              },
              {
                name: "Nusret Guso",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050356",
              },
              {
                name: "Mirsad Suljagic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050359",
              },
              {
                name: "Muhamed Adzem",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051089",
              },
              {
                name: "Suljo Karkelj",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051091",
              },
              {
                name: "Senad Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051093",
              },
              {
                name: "Omer Ugljesa",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051096",
              },
              {
                name: "Zehrudin Scuk",
                association: "Army of Bosnia and Herzegovina",
                personId: "4099408",
              },
              {
                name: "Asim Kadic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4177209",
              },
              {
                name: "Izet Hujic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4198965",
              },
              {
                name: "Ibrahim Ceco",
                association: "Army of Bosnia and Herzegovina",
                personId: "4245297",
              },
            ],
            status: "POSITIVE",
            name: "Edin Dzeko",
            gender: "MALE",
            dateOfBirth: "1972-03-14T00:00:00.000+00:00",
            yearOfBirth: 1972,
            nationality: "Bosnian",
            nationalityCode: "BA",
            placeOfBirth: null,
            isPep: false,
            isSanctionsCurrent: false,
            isSanctionsPrevious: false,
            isFinancialRegulator: false,
            isDisqualifiedDirector: false,
            isInsolvent: false,
            isAdverseMedia: true,
            isLawEnforcement: true,
            pepLevel: null,
            personId: "3543895",
            imageThumbnail:
              "https://secure.c6-intelligence.com/c6images/0020170000/0020169101.jpg",
            sanctions: [],
            linkedBusinesses: [
              {
                businessId: "724411",
                businessName: "Army of Bosnia and Herzegovina",
                position: "Former Member",
              },
            ],
            linkedPersons: [],
            hasNewChanges: false,
            keywords: ["LF", "AM"],
          },
          unresolved: 0,
          individualRiskScore: {
            id: 3,
            createdAt: "2021-09-13T07:38:59.437+00:00",
            updatedAt: "2021-09-13T07:38:59.437+00:00",
            risk: 205.6,
            updatedRisk: null,
            riskLevel: "HIGH",
            updatedRiskLevel: null,
            sanctionedPersonOrCountry: {
              info: false,
              score: 0.0,
            },
            pep: {
              info: 0,
              score: 0.0,
            },
            previouslySanctionedPerson: {
              info: false,
              score: 0.0,
            },
            financialRegulator: {
              info: false,
              score: 0.0,
            },
            lawEnforcement: {
              info: true,
              score: 70.0,
            },
            adverseMedia: {
              info: true,
              score: 60.0,
            },
            countryOfResidence: {
              fatf: {
                info: "BA",
                score: 7.5,
              },
              basel: {
                info: "BA",
                score: 4.51,
              },
              cpi: {
                info: "BA",
                score: 6.54,
              },
            },
            idIssuingCountry: {
              fatf: {
                info: null,
                score: 20.0,
              },
              basel: {
                info: null,
                score: 10.0,
              },
              cpi: {
                info: null,
                score: 10.0,
              },
            },
            nationality: {
              fatf: {
                info: "BA",
                score: 6.0,
              },
              basel: {
                info: "BA",
                score: 4.51,
              },
              cpi: {
                info: "BA",
                score: 6.54,
              },
            },
            settingId: 1,
            scoringId: 1,
            numberOfChanges: 0,
            reScreeningPeriod: 3.0,
          },
          reScreenedAt: null,
          archivedAt: null,
          enableOnGoingMonitoring: true,
          omStartPeriod: null,
          hasNewChanges: false,
          filterLevel: null,
          escalatedAt: null,
          omLastUpdatedAt: null,
          positiveMatch: {
            id: 977,
            createdAt: "2021-09-13T06:45:21.242+00:00",
            updatedAt: "2021-09-13T08:04:53.476+00:00",
            matchId: "M01",
            keyData: {
              aliases: [
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Dzeka",
                },
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Džeko",
                },
              ],
              email: "",
              telephone: "",
              website: null,
              addresses: [
                "Everett, Washington, United States of America",
                "Drugovici, Gacko, Bosnia and Herzegovina",
                "Trusina, Bosnia and Herzegovina",
                "Jablanica, Bosnia and Herzegovina",
              ],
            },
            furtherInformation: {
              politicalPositions: [],
              notes: [
                "Reputational Risk Exposure",
                "Regulatory Enforcement Lists",
              ],
            },
            sources: [
              {
                originalUrl: "http://www.bim.ba/en/204/10/25556/",
                c6Url: "",
                keywords: ["PEP", "AM"],
                creationDate: "2010-02-09T00:00:00.000+00:00",
                title: null,
                summary:
                  "Rasema Handanovic and Edin Dzeka, suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26556/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title:
                  "Hodzic et al: Another Indictment for Trusina Crimes Filed",
                summary:
                  "Rasema Handanovic and Edin Dzeka, who are suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26549/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title: "Indictment for Trusina Crimes Confirmed",
                summary:
                  '12 March 2010 The Court of Bosnia and Herzegovina has confirmed an indictment against three former members of the Army of Bosnia and Herzegovina accused of participating in crimes against Croats in Trusina village in Herzegovina in April 1993. The indictment alleges that on that day Memic, Nedzad Hodzic, Rasema Handanovic, known as Zolja, and other members of the "Zulfikar" Squad participated in the shooting of HVO members in Gaj hamlet. The indictment further alleges that Nedzad Hodzic issued the order for the shooting.',
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.croatiantimes.com/news/General_News/2011-04-14/18582/Two_arrested_in_US_for_war_crimes_against_Bosnian_Croats",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2011-04-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "The 39-year-old Edin Dzeko and 38-year-old Rasema Handanovic were arrested in the states of Washington and Oregon, respectively, on an international warrant issued by Bosnia and Herzegovina. Dzeko was living in the city of Everett, Washington while Handanovic was in Portland, Oregon where she was arrested, the daily Jutarnji List.",
                keywordsMatched: ["arrested", "warrant"],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2306&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019800000/0019799742.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1304&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019805000/0019801368.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2511&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020107251.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1480&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020108485.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2532&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020125000/0020122720.pdf",
                keywords: ["LF"],
                creationDate: "2012-07-26T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2553&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020140000/0020138718.pdf",
                keywords: ["LF"],
                creationDate: "2012-08-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/witness-claims-edin-dzeko-killed-civilians",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-09-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Handanovic, a former member of the Zulifkar special purposes detachment of the Army of Bosnia and Herzegovina, said that Dzeko was a member of her unit and killed the couple with a burst of fire from an automatic rifle. Dzeko's lawyer, Vasvija Vidovic, claimed during cross examination that the killing of the elderly couple was in fact done by Handanovic. The indictment says Dzeko killed two elderly women and one man during the attack in Trusina. Handanovic has admitted guilt for shooting several civilians and for imprisoning members of the Croatian Defence Forces, HVO, a crime Dzeko is also charged with taking part in. After describing how Dzeko killed the elderly couple during the initial attack on Trusina, Handanovic said that members of the Zulfikar unit headed back to Gaj, where she saw six or seven men in civilian clothes and uniforms lined up in front of a barn. Nedzad yelled to shoot and we shot,” the witness said, adding that Dzeko was among those to fire.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-was-in-trusina-during-the-attack-says-witness",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-10-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "At the trial of Edin Dzeko, a prosecution witness says he saw the defendant during the attack on the village of Trusina in 1993, but that he did not witness any murders.",
                keywordsMatched: ["prosecution"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-granted-release-from-custody",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-05-31T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko, accused of killing and illegally detaining Croats during the 1990s conflict, has been released on bail in the midst of his trial. The Bosnian court on Thursday decided to release Dzeko from custody after he put up around 300,000 euro of property as security against potential abscondment. Dzeko, a former Bosnian Army serviceman, is charged with participating in the execution of several Croatian Defence Council soldiers and Croat civilians in the village of Trusina near the southern Bosnian town of Konjic, and participating in the illegal arrest of nine civilians in Jablanica. The court released Dzeko after he offered the financial guarantee but banned him from leaving his place of residence, temporarily confiscated his passport and said that he was barred from using his personal ID to cross state borders. After the war, Dzeko emigrated to the US, but the American authorities extradited him to Bosnia in December 2011. Bosnian Fighter Dzeko Released From Custody Stanisic and Simatovic, Belgrade's Security Strongmen Kosovo Guerrilla Trial Witness Slams EU Prosecutor",
                keywordsMatched: [
                  "illegal",
                  "confiscated",
                  "arrest",
                  "illegally",
                  "charged with",
                ],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2807&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020355000/0020351000.pdf",
                keywords: ["LF"],
                creationDate: "2013-06-03T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/beginning-of-zenica-crimes-trial",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-09-02T00:00:00.000+00:00",
                title: "Beginning of Zenica Crimes Trial",
                summary:
                  "com, including premium articles, full audio, video and documents Register for free On Tuesday, September 3 the Defence of Edin Dzeko, who is charged with crimes in Jablanica, will examine a protected witness.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/closing-arguments-in-three-trials-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-22T00:00:00.000+00:00",
                title: "Closing Arguments in Three Trials Next Week",
                summary:
                  "On Tuesday, new Defence witnesses will testify at the trials of Edin Dzeko for crimes in Trusina and Jablanica, and Predrag Milisavljevic, Milos Pantelic and Ljubomir Tasic for crimes in Visegrad.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/appeals-against-basic-and-sijak-verdicts-due-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-28T00:00:00.000+00:00",
                title: "Appeals against Basic and Sijak Verdicts Due Next Week",
                summary:
                  "On that same day the trials are due to continue in the case against Najdan Mladjenovic and Savo Zivkovic for crimes in Bratunac, Edin Dzeko for crimes in Trusina and Jablanica, as well as Ivan Zelenika, Srecko Herceg, Edib Buljubasic, Ivan Medic and Marina Grubisic-Fejzic, who are charged with crimes in Dretelj.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/witness-says-he-is-not-capable-of-testifying",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-11-28T00:00:00.000+00:00",
                title: "Witness Says He is not Capable of Testifying",
                summary:
                  "This witness was due to testify in defence of indictee Dzeko, former member of “Zulfikar” Squad with the Army of Bosnia and Herzegovina, ABiH. Vasvija Vidovic, Defence attorney of indictee Dzeko, said that she stuck to her request for examination of this witness. “We would not insist of examining him, if he were not the direct eyewitness of the event charged upon Dzeko,” Vidovic said, adding that, in his previous statements the witness did not mention that he was not capable of testifying. Dzeko is on trial for committing murders of Croats in Trusina on April 16, 1993. The trial is due to continue on December 10, when indictee Dzeko will testify in his defence.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-says-he-s-not-murderer",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-12-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko told his own trial that witnesses who said he took part in the execution of several Croats in the village of Trusina near Konjic in 1993 were lying. Dzeko, a former member of the Bosnian Army's Zulfikar detachment, is charged with taking part in the execution of civilians and imprisoned fighters from the Croatian Defence Council, along with other members of his unit, on April 16, 1993. According to Dzeko, Bosnian Army troops went into action on the morning of April 16 after their foes opened fire first.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/seven-indictees-due-to-enter-pleas-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-02-17T00:00:00.000+00:00",
                title: null,
                summary:
                  "The source contains media information about the subject.",
                keywordsMatched: [""],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3161&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020505000/0020500489.pdf",
                keywords: ["LF"],
                creationDate: "2014-03-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3191&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020510000/0020509785.pdf",
                keywords: ["LF"],
                creationDate: "2014-04-07T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-sentenced-to-12-years-in-prison",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-06-30T00:00:00.000+00:00",
                title:
                  "osniak Soldier Jailed for Killing Croats in Trusina :: Balkan Insight",
                summary:
                  "The court in Sarajevo on Friday convicted Dzeko, a former member of the Bosnian Army's Zulfikar Squad, of involvement in the execution of six Croatian Defence Council fighters and the murder of a married couple during an attack on Trusina on April 16, 1993. He cited the testimony of one prosecution witness, Rasema Handanovic, a former member of the Zulfikar Squad who was also jailed for crimes committed during the Trusina attack who said that she saw the Dzeko during the execution. “Rasema Handanovic said that Dzeko was standing at her right side when the shooting began,” he said. The court did not accept the prosecution's claim that the fighters who were killed were civilians, or the claim that Dzeko could not have participated in the execution because he had driven some of his wounded comrades out of Trusina before it happened. “The chamber established that he participated in the transportation of the wounded, but that he was also present during the very act of the execution,” Maksumic said. Dzeko was also sentenced to seven years in prison for killing married couple Ilija and Andja Ivankovic in Trusina, and the court ordered a combined sentence of 12 years for both convictions. However Dzeko was acquitted of the illegal arrest and detention of Croatian civilians at the Zulfikar Squad's base in Donja Jablanica in September 1993, as well as beatings and looting in the town of Jablanica in the second half of 1993. The judge explained that Dzeko, as an ordinary soldier, was obeying orders given by a military police officer who had the list of people to be arrested. Dzeko was also acquitted of taking money from victims and of ordering three other soldiers to beat a man with wooden bars and concrete blocks. The fact that Dzeko has a family, that he was young when the crime was committed and that he acted correctly during the trial was taken into account by the court as mitigating circumstances. His trial started in 2012 after he was extradited from the United States the previous year.",
                keywordsMatched: [
                  "jailed",
                  "sentence",
                  "detention",
                  "arrested",
                  "arrest",
                  "prosecution",
                  "illegal",
                ],
              },
            ],
            connections: [
              {
                name: "Sefer Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "149737",
              },
              {
                name: "Rasim Delic",
                association: "Army of Bosnia and Herzegovina",
                personId: "560798",
              },
              {
                name: "Suad Kapic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2342755",
              },
              {
                name: "Emir Mustafic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2369881",
              },
              {
                name: "Adil Ruznic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2390959",
              },
              {
                name: "Nihad Bojadzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3088090",
              },
              {
                name: "Mehura Selimovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189355",
              },
              {
                name: "Alija Osmic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189403",
              },
              {
                name: "Senad Hakalovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189563",
              },
              {
                name: "Nedzad Hodzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189565",
              },
              {
                name: "Mensur Memic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189568",
              },
              {
                name: "Dzevad Salcin",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189575",
              },
              {
                name: "Zulfikar Alispago",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189583",
              },
              {
                name: "Rasema Handanovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189585",
              },
              {
                name: "Eso Macic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3392995",
              },
              {
                name: "Osman Sego",
                association: "Army of Bosnia and Herzegovina",
                personId: "3396470",
              },
              {
                name: "Nezir Kazic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3707226",
              },
              {
                name: "Azemin Sadikovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3914281",
              },
              {
                name: "Osman Brkan",
                association: "Army of Bosnia and Herzegovina",
                personId: "3962603",
              },
              {
                name: "Vehid Subotic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4018155",
              },
              {
                name: "Nusret Guso",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050356",
              },
              {
                name: "Mirsad Suljagic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050359",
              },
              {
                name: "Muhamed Adzem",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051089",
              },
              {
                name: "Suljo Karkelj",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051091",
              },
              {
                name: "Senad Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051093",
              },
              {
                name: "Omer Ugljesa",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051096",
              },
              {
                name: "Zehrudin Scuk",
                association: "Army of Bosnia and Herzegovina",
                personId: "4099408",
              },
              {
                name: "Asim Kadic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4177209",
              },
              {
                name: "Izet Hujic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4198965",
              },
              {
                name: "Ibrahim Ceco",
                association: "Army of Bosnia and Herzegovina",
                personId: "4245297",
              },
            ],
            status: "POSITIVE",
            name: "Edin Dzeko",
            gender: "MALE",
            dateOfBirth: "1972-03-14T00:00:00.000+00:00",
            yearOfBirth: 1972,
            nationality: "Bosnian",
            nationalityCode: "BA",
            placeOfBirth: null,
            isPep: false,
            isSanctionsCurrent: false,
            isSanctionsPrevious: false,
            isFinancialRegulator: false,
            isDisqualifiedDirector: false,
            isInsolvent: false,
            isAdverseMedia: true,
            isLawEnforcement: true,
            pepLevel: null,
            personId: "3543895",
            imageThumbnail:
              "https://secure.c6-intelligence.com/c6images/0020170000/0020169101.jpg",
            sanctions: [],
            linkedBusinesses: [
              {
                businessId: "724411",
                businessName: "Army of Bosnia and Herzegovina",
                position: "Former Member",
              },
            ],
            linkedPersons: [],
            hasNewChanges: false,
            keywords: ["LF", "AM"],
          },
          reScreeningEditable: true,
          blacklistMatched: false,
        },
        kycBlacklist: {
          id: 3,
          createdAt: "2021-09-13T07:06:31.000+00:00",
          updatedAt: "2021-09-13T07:06:31.000+00:00",
          blacklistId: "BLC00003",
          fullName: "Dzeko Sc",
          categories: [],
          nationality: "IT",
          dateOfBirth: null,
          yearOfBirth: null,
          gender: "MALE",
          countryOfResidence: "IT",
          idIssuingCountry: null,
          placeOfBirth: null,
          email: null,
          phone: null,
          address: null,
          furtherInformation: null,
          isActive: true,
          kycMatchedAt: null,
          clientType: "USER",
        },
        status: "UNRESOLVED",
      },
      {
        id: 4,
        createdAt: "2021-09-13T07:06:31.051+00:00",
        updatedAt: "2021-09-13T07:38:54.921+00:00",
        createdBy: {
          id: 5,
          firstName: "JordanCompanyAdmin",
          lastName: "",
          email: "jordan@islandpeakcloud.sg",
          colorCode: "#607D8B",
          avatar: null,
        },
        lastModifiedBy: {
          id: 5,
          firstName: "JordanCompanyAdmin",
          lastName: "",
          email: "jordan@islandpeakcloud.sg",
          colorCode: "#607D8B",
          avatar: null,
        },
        kycRequest: {
          id: 61,
          createdAt: "2021-09-13T06:45:17.501+00:00",
          updatedAt: "2021-09-13T07:38:59.976+00:00",
          messageStatus: "DONE",
          clientType: "USER",
          kycId: "KYC00061",
          individualRequest: {
            id: 61,
            createdAt: "2021-09-13T06:45:17.488+00:00",
            updatedAt: "2021-09-13T06:49:33.795+00:00",
            forename: "Edin",
            middlename: null,
            surname: "Dzeko",
            gender: "MALE",
            email: null,
            phone: null,
            address1: null,
            address2: null,
            dateOfBirth: null,
            yearOfBirth: null,
            placeOfBirth: null,
            nationality: null,
            countryOfResidence: null,
            governmentIdNumber: null,
            idIssuingCountry: null,
            referenceId: null,
            enableReScreening: false,
            enableOnGoingMonitoring: true,
            assignee: null,
            name: "Edin Dzeko",
            pep: true,
            currentSanctions: true,
            financialRegulator: true,
            lawEnforcement: true,
            adverseMedia: true,
            omStartPeriod: null,
            reScreeningEditable: true,
          },
          enableReScreening: false,
          type: "INDIVIDUAL",
          lastScreenedAt: "2021-09-13T07:38:59.448+00:00",
          status: "COMPLETED",
          referenceId: null,
          individualPositiveMatch: {
            id: 977,
            createdAt: "2021-09-13T06:45:21.242+00:00",
            updatedAt: "2021-09-13T08:04:53.476+00:00",
            matchId: "M01",
            keyData: {
              aliases: [
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Dzeka",
                },
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Džeko",
                },
              ],
              email: "",
              telephone: "",
              website: null,
              addresses: [
                "Everett, Washington, United States of America",
                "Drugovici, Gacko, Bosnia and Herzegovina",
                "Trusina, Bosnia and Herzegovina",
                "Jablanica, Bosnia and Herzegovina",
              ],
            },
            furtherInformation: {
              politicalPositions: [],
              notes: [
                "Reputational Risk Exposure",
                "Regulatory Enforcement Lists",
              ],
            },
            sources: [
              {
                originalUrl: "http://www.bim.ba/en/204/10/25556/",
                c6Url: "",
                keywords: ["PEP", "AM"],
                creationDate: "2010-02-09T00:00:00.000+00:00",
                title: null,
                summary:
                  "Rasema Handanovic and Edin Dzeka, suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26556/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title:
                  "Hodzic et al: Another Indictment for Trusina Crimes Filed",
                summary:
                  "Rasema Handanovic and Edin Dzeka, who are suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26549/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title: "Indictment for Trusina Crimes Confirmed",
                summary:
                  '12 March 2010 The Court of Bosnia and Herzegovina has confirmed an indictment against three former members of the Army of Bosnia and Herzegovina accused of participating in crimes against Croats in Trusina village in Herzegovina in April 1993. The indictment alleges that on that day Memic, Nedzad Hodzic, Rasema Handanovic, known as Zolja, and other members of the "Zulfikar" Squad participated in the shooting of HVO members in Gaj hamlet. The indictment further alleges that Nedzad Hodzic issued the order for the shooting.',
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.croatiantimes.com/news/General_News/2011-04-14/18582/Two_arrested_in_US_for_war_crimes_against_Bosnian_Croats",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2011-04-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "The 39-year-old Edin Dzeko and 38-year-old Rasema Handanovic were arrested in the states of Washington and Oregon, respectively, on an international warrant issued by Bosnia and Herzegovina. Dzeko was living in the city of Everett, Washington while Handanovic was in Portland, Oregon where she was arrested, the daily Jutarnji List.",
                keywordsMatched: ["arrested", "warrant"],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2306&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019800000/0019799742.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1304&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019805000/0019801368.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2511&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020107251.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1480&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020108485.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2532&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020125000/0020122720.pdf",
                keywords: ["LF"],
                creationDate: "2012-07-26T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2553&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020140000/0020138718.pdf",
                keywords: ["LF"],
                creationDate: "2012-08-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/witness-claims-edin-dzeko-killed-civilians",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-09-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Handanovic, a former member of the Zulifkar special purposes detachment of the Army of Bosnia and Herzegovina, said that Dzeko was a member of her unit and killed the couple with a burst of fire from an automatic rifle. Dzeko's lawyer, Vasvija Vidovic, claimed during cross examination that the killing of the elderly couple was in fact done by Handanovic. The indictment says Dzeko killed two elderly women and one man during the attack in Trusina. Handanovic has admitted guilt for shooting several civilians and for imprisoning members of the Croatian Defence Forces, HVO, a crime Dzeko is also charged with taking part in. After describing how Dzeko killed the elderly couple during the initial attack on Trusina, Handanovic said that members of the Zulfikar unit headed back to Gaj, where she saw six or seven men in civilian clothes and uniforms lined up in front of a barn. Nedzad yelled to shoot and we shot,” the witness said, adding that Dzeko was among those to fire.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-was-in-trusina-during-the-attack-says-witness",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-10-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "At the trial of Edin Dzeko, a prosecution witness says he saw the defendant during the attack on the village of Trusina in 1993, but that he did not witness any murders.",
                keywordsMatched: ["prosecution"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-granted-release-from-custody",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-05-31T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko, accused of killing and illegally detaining Croats during the 1990s conflict, has been released on bail in the midst of his trial. The Bosnian court on Thursday decided to release Dzeko from custody after he put up around 300,000 euro of property as security against potential abscondment. Dzeko, a former Bosnian Army serviceman, is charged with participating in the execution of several Croatian Defence Council soldiers and Croat civilians in the village of Trusina near the southern Bosnian town of Konjic, and participating in the illegal arrest of nine civilians in Jablanica. The court released Dzeko after he offered the financial guarantee but banned him from leaving his place of residence, temporarily confiscated his passport and said that he was barred from using his personal ID to cross state borders. After the war, Dzeko emigrated to the US, but the American authorities extradited him to Bosnia in December 2011. Bosnian Fighter Dzeko Released From Custody Stanisic and Simatovic, Belgrade's Security Strongmen Kosovo Guerrilla Trial Witness Slams EU Prosecutor",
                keywordsMatched: [
                  "illegal",
                  "confiscated",
                  "arrest",
                  "illegally",
                  "charged with",
                ],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2807&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020355000/0020351000.pdf",
                keywords: ["LF"],
                creationDate: "2013-06-03T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/beginning-of-zenica-crimes-trial",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-09-02T00:00:00.000+00:00",
                title: "Beginning of Zenica Crimes Trial",
                summary:
                  "com, including premium articles, full audio, video and documents Register for free On Tuesday, September 3 the Defence of Edin Dzeko, who is charged with crimes in Jablanica, will examine a protected witness.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/closing-arguments-in-three-trials-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-22T00:00:00.000+00:00",
                title: "Closing Arguments in Three Trials Next Week",
                summary:
                  "On Tuesday, new Defence witnesses will testify at the trials of Edin Dzeko for crimes in Trusina and Jablanica, and Predrag Milisavljevic, Milos Pantelic and Ljubomir Tasic for crimes in Visegrad.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/appeals-against-basic-and-sijak-verdicts-due-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-28T00:00:00.000+00:00",
                title: "Appeals against Basic and Sijak Verdicts Due Next Week",
                summary:
                  "On that same day the trials are due to continue in the case against Najdan Mladjenovic and Savo Zivkovic for crimes in Bratunac, Edin Dzeko for crimes in Trusina and Jablanica, as well as Ivan Zelenika, Srecko Herceg, Edib Buljubasic, Ivan Medic and Marina Grubisic-Fejzic, who are charged with crimes in Dretelj.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/witness-says-he-is-not-capable-of-testifying",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-11-28T00:00:00.000+00:00",
                title: "Witness Says He is not Capable of Testifying",
                summary:
                  "This witness was due to testify in defence of indictee Dzeko, former member of “Zulfikar” Squad with the Army of Bosnia and Herzegovina, ABiH. Vasvija Vidovic, Defence attorney of indictee Dzeko, said that she stuck to her request for examination of this witness. “We would not insist of examining him, if he were not the direct eyewitness of the event charged upon Dzeko,” Vidovic said, adding that, in his previous statements the witness did not mention that he was not capable of testifying. Dzeko is on trial for committing murders of Croats in Trusina on April 16, 1993. The trial is due to continue on December 10, when indictee Dzeko will testify in his defence.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-says-he-s-not-murderer",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-12-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko told his own trial that witnesses who said he took part in the execution of several Croats in the village of Trusina near Konjic in 1993 were lying. Dzeko, a former member of the Bosnian Army's Zulfikar detachment, is charged with taking part in the execution of civilians and imprisoned fighters from the Croatian Defence Council, along with other members of his unit, on April 16, 1993. According to Dzeko, Bosnian Army troops went into action on the morning of April 16 after their foes opened fire first.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/seven-indictees-due-to-enter-pleas-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-02-17T00:00:00.000+00:00",
                title: null,
                summary:
                  "The source contains media information about the subject.",
                keywordsMatched: [""],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3161&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020505000/0020500489.pdf",
                keywords: ["LF"],
                creationDate: "2014-03-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3191&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020510000/0020509785.pdf",
                keywords: ["LF"],
                creationDate: "2014-04-07T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-sentenced-to-12-years-in-prison",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-06-30T00:00:00.000+00:00",
                title:
                  "osniak Soldier Jailed for Killing Croats in Trusina :: Balkan Insight",
                summary:
                  "The court in Sarajevo on Friday convicted Dzeko, a former member of the Bosnian Army's Zulfikar Squad, of involvement in the execution of six Croatian Defence Council fighters and the murder of a married couple during an attack on Trusina on April 16, 1993. He cited the testimony of one prosecution witness, Rasema Handanovic, a former member of the Zulfikar Squad who was also jailed for crimes committed during the Trusina attack who said that she saw the Dzeko during the execution. “Rasema Handanovic said that Dzeko was standing at her right side when the shooting began,” he said. The court did not accept the prosecution's claim that the fighters who were killed were civilians, or the claim that Dzeko could not have participated in the execution because he had driven some of his wounded comrades out of Trusina before it happened. “The chamber established that he participated in the transportation of the wounded, but that he was also present during the very act of the execution,” Maksumic said. Dzeko was also sentenced to seven years in prison for killing married couple Ilija and Andja Ivankovic in Trusina, and the court ordered a combined sentence of 12 years for both convictions. However Dzeko was acquitted of the illegal arrest and detention of Croatian civilians at the Zulfikar Squad's base in Donja Jablanica in September 1993, as well as beatings and looting in the town of Jablanica in the second half of 1993. The judge explained that Dzeko, as an ordinary soldier, was obeying orders given by a military police officer who had the list of people to be arrested. Dzeko was also acquitted of taking money from victims and of ordering three other soldiers to beat a man with wooden bars and concrete blocks. The fact that Dzeko has a family, that he was young when the crime was committed and that he acted correctly during the trial was taken into account by the court as mitigating circumstances. His trial started in 2012 after he was extradited from the United States the previous year.",
                keywordsMatched: [
                  "jailed",
                  "sentence",
                  "detention",
                  "arrested",
                  "arrest",
                  "prosecution",
                  "illegal",
                ],
              },
            ],
            connections: [
              {
                name: "Sefer Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "149737",
              },
              {
                name: "Rasim Delic",
                association: "Army of Bosnia and Herzegovina",
                personId: "560798",
              },
              {
                name: "Suad Kapic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2342755",
              },
              {
                name: "Emir Mustafic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2369881",
              },
              {
                name: "Adil Ruznic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2390959",
              },
              {
                name: "Nihad Bojadzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3088090",
              },
              {
                name: "Mehura Selimovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189355",
              },
              {
                name: "Alija Osmic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189403",
              },
              {
                name: "Senad Hakalovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189563",
              },
              {
                name: "Nedzad Hodzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189565",
              },
              {
                name: "Mensur Memic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189568",
              },
              {
                name: "Dzevad Salcin",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189575",
              },
              {
                name: "Zulfikar Alispago",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189583",
              },
              {
                name: "Rasema Handanovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189585",
              },
              {
                name: "Eso Macic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3392995",
              },
              {
                name: "Osman Sego",
                association: "Army of Bosnia and Herzegovina",
                personId: "3396470",
              },
              {
                name: "Nezir Kazic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3707226",
              },
              {
                name: "Azemin Sadikovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3914281",
              },
              {
                name: "Osman Brkan",
                association: "Army of Bosnia and Herzegovina",
                personId: "3962603",
              },
              {
                name: "Vehid Subotic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4018155",
              },
              {
                name: "Nusret Guso",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050356",
              },
              {
                name: "Mirsad Suljagic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050359",
              },
              {
                name: "Muhamed Adzem",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051089",
              },
              {
                name: "Suljo Karkelj",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051091",
              },
              {
                name: "Senad Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051093",
              },
              {
                name: "Omer Ugljesa",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051096",
              },
              {
                name: "Zehrudin Scuk",
                association: "Army of Bosnia and Herzegovina",
                personId: "4099408",
              },
              {
                name: "Asim Kadic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4177209",
              },
              {
                name: "Izet Hujic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4198965",
              },
              {
                name: "Ibrahim Ceco",
                association: "Army of Bosnia and Herzegovina",
                personId: "4245297",
              },
            ],
            status: "POSITIVE",
            name: "Edin Dzeko",
            gender: "MALE",
            dateOfBirth: "1972-03-14T00:00:00.000+00:00",
            yearOfBirth: 1972,
            nationality: "Bosnian",
            nationalityCode: "BA",
            placeOfBirth: null,
            isPep: false,
            isSanctionsCurrent: false,
            isSanctionsPrevious: false,
            isFinancialRegulator: false,
            isDisqualifiedDirector: false,
            isInsolvent: false,
            isAdverseMedia: true,
            isLawEnforcement: true,
            pepLevel: null,
            personId: "3543895",
            imageThumbnail:
              "https://secure.c6-intelligence.com/c6images/0020170000/0020169101.jpg",
            sanctions: [],
            linkedBusinesses: [
              {
                businessId: "724411",
                businessName: "Army of Bosnia and Herzegovina",
                position: "Former Member",
              },
            ],
            linkedPersons: [],
            hasNewChanges: false,
            keywords: ["LF", "AM"],
          },
          unresolved: 0,
          individualRiskScore: {
            id: 3,
            createdAt: "2021-09-13T07:38:59.437+00:00",
            updatedAt: "2021-09-13T07:38:59.437+00:00",
            risk: 205.6,
            updatedRisk: null,
            riskLevel: "HIGH",
            updatedRiskLevel: null,
            sanctionedPersonOrCountry: {
              info: false,
              score: 0.0,
            },
            pep: {
              info: 0,
              score: 0.0,
            },
            previouslySanctionedPerson: {
              info: false,
              score: 0.0,
            },
            financialRegulator: {
              info: false,
              score: 0.0,
            },
            lawEnforcement: {
              info: true,
              score: 70.0,
            },
            adverseMedia: {
              info: true,
              score: 60.0,
            },
            countryOfResidence: {
              fatf: {
                info: "BA",
                score: 7.5,
              },
              basel: {
                info: "BA",
                score: 4.51,
              },
              cpi: {
                info: "BA",
                score: 6.54,
              },
            },
            idIssuingCountry: {
              fatf: {
                info: null,
                score: 20.0,
              },
              basel: {
                info: null,
                score: 10.0,
              },
              cpi: {
                info: null,
                score: 10.0,
              },
            },
            nationality: {
              fatf: {
                info: "BA",
                score: 6.0,
              },
              basel: {
                info: "BA",
                score: 4.51,
              },
              cpi: {
                info: "BA",
                score: 6.54,
              },
            },
            settingId: 1,
            scoringId: 1,
            numberOfChanges: 0,
            reScreeningPeriod: 3.0,
          },
          reScreenedAt: null,
          archivedAt: null,
          enableOnGoingMonitoring: true,
          omStartPeriod: null,
          hasNewChanges: false,
          filterLevel: null,
          escalatedAt: null,
          omLastUpdatedAt: null,
          positiveMatch: {
            id: 977,
            createdAt: "2021-09-13T06:45:21.242+00:00",
            updatedAt: "2021-09-13T08:04:53.476+00:00",
            matchId: "M01",
            keyData: {
              aliases: [
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Dzeka",
                },
                {
                  title: null,
                  alternateTitle: null,
                  name: "Edin Džeko",
                },
              ],
              email: "",
              telephone: "",
              website: null,
              addresses: [
                "Everett, Washington, United States of America",
                "Drugovici, Gacko, Bosnia and Herzegovina",
                "Trusina, Bosnia and Herzegovina",
                "Jablanica, Bosnia and Herzegovina",
              ],
            },
            furtherInformation: {
              politicalPositions: [],
              notes: [
                "Reputational Risk Exposure",
                "Regulatory Enforcement Lists",
              ],
            },
            sources: [
              {
                originalUrl: "http://www.bim.ba/en/204/10/25556/",
                c6Url: "",
                keywords: ["PEP", "AM"],
                creationDate: "2010-02-09T00:00:00.000+00:00",
                title: null,
                summary:
                  "Rasema Handanovic and Edin Dzeka, suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26556/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title:
                  "Hodzic et al: Another Indictment for Trusina Crimes Filed",
                summary:
                  "Rasema Handanovic and Edin Dzeka, who are suspected of the same crime, are reported to have been arrested in the US.",
                keywordsMatched: ["arrested"],
              },
              {
                originalUrl: "http://www.bim.ba/en/209/10/26549/",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2010-03-15T00:00:00.000+00:00",
                title: "Indictment for Trusina Crimes Confirmed",
                summary:
                  '12 March 2010 The Court of Bosnia and Herzegovina has confirmed an indictment against three former members of the Army of Bosnia and Herzegovina accused of participating in crimes against Croats in Trusina village in Herzegovina in April 1993. The indictment alleges that on that day Memic, Nedzad Hodzic, Rasema Handanovic, known as Zolja, and other members of the "Zulfikar" Squad participated in the shooting of HVO members in Gaj hamlet. The indictment further alleges that Nedzad Hodzic issued the order for the shooting.',
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.croatiantimes.com/news/General_News/2011-04-14/18582/Two_arrested_in_US_for_war_crimes_against_Bosnian_Croats",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2011-04-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "The 39-year-old Edin Dzeko and 38-year-old Rasema Handanovic were arrested in the states of Washington and Oregon, respectively, on an international warrant issued by Bosnia and Herzegovina. Dzeko was living in the city of Everett, Washington while Handanovic was in Portland, Oregon where she was arrested, the daily Jutarnji List.",
                keywordsMatched: ["arrested", "warrant"],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2306&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019800000/0019799742.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1304&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0019805000/0019801368.pdf",
                keywords: ["LF"],
                creationDate: "2011-12-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2511&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020107251.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.tuzilastvobih.gov.ba/index.php?id=1480&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020110000/0020108485.pdf",
                keywords: ["LF"],
                creationDate: "2012-06-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2532&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020125000/0020122720.pdf",
                keywords: ["LF"],
                creationDate: "2012-07-26T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2553&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020140000/0020138718.pdf",
                keywords: ["LF"],
                creationDate: "2012-08-22T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/witness-claims-edin-dzeko-killed-civilians",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-09-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Handanovic, a former member of the Zulifkar special purposes detachment of the Army of Bosnia and Herzegovina, said that Dzeko was a member of her unit and killed the couple with a burst of fire from an automatic rifle. Dzeko's lawyer, Vasvija Vidovic, claimed during cross examination that the killing of the elderly couple was in fact done by Handanovic. The indictment says Dzeko killed two elderly women and one man during the attack in Trusina. Handanovic has admitted guilt for shooting several civilians and for imprisoning members of the Croatian Defence Forces, HVO, a crime Dzeko is also charged with taking part in. After describing how Dzeko killed the elderly couple during the initial attack on Trusina, Handanovic said that members of the Zulfikar unit headed back to Gaj, where she saw six or seven men in civilian clothes and uniforms lined up in front of a barn. Nedzad yelled to shoot and we shot,” the witness said, adding that Dzeko was among those to fire.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-was-in-trusina-during-the-attack-says-witness",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2012-10-15T00:00:00.000+00:00",
                title: null,
                summary:
                  "At the trial of Edin Dzeko, a prosecution witness says he saw the defendant during the attack on the village of Trusina in 1993, but that he did not witness any murders.",
                keywordsMatched: ["prosecution"],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-granted-release-from-custody",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-05-31T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko, accused of killing and illegally detaining Croats during the 1990s conflict, has been released on bail in the midst of his trial. The Bosnian court on Thursday decided to release Dzeko from custody after he put up around 300,000 euro of property as security against potential abscondment. Dzeko, a former Bosnian Army serviceman, is charged with participating in the execution of several Croatian Defence Council soldiers and Croat civilians in the village of Trusina near the southern Bosnian town of Konjic, and participating in the illegal arrest of nine civilians in Jablanica. The court released Dzeko after he offered the financial guarantee but banned him from leaving his place of residence, temporarily confiscated his passport and said that he was barred from using his personal ID to cross state borders. After the war, Dzeko emigrated to the US, but the American authorities extradited him to Bosnia in December 2011. Bosnian Fighter Dzeko Released From Custody Stanisic and Simatovic, Belgrade's Security Strongmen Kosovo Guerrilla Trial Witness Slams EU Prosecutor",
                keywordsMatched: [
                  "illegal",
                  "confiscated",
                  "arrest",
                  "illegally",
                  "charged with",
                ],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=2807&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020355000/0020351000.pdf",
                keywords: ["LF"],
                creationDate: "2013-06-03T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/beginning-of-zenica-crimes-trial",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-09-02T00:00:00.000+00:00",
                title: "Beginning of Zenica Crimes Trial",
                summary:
                  "com, including premium articles, full audio, video and documents Register for free On Tuesday, September 3 the Defence of Edin Dzeko, who is charged with crimes in Jablanica, will examine a protected witness.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/closing-arguments-in-three-trials-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-22T00:00:00.000+00:00",
                title: "Closing Arguments in Three Trials Next Week",
                summary:
                  "On Tuesday, new Defence witnesses will testify at the trials of Edin Dzeko for crimes in Trusina and Jablanica, and Predrag Milisavljevic, Milos Pantelic and Ljubomir Tasic for crimes in Visegrad.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/appeals-against-basic-and-sijak-verdicts-due-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-10-28T00:00:00.000+00:00",
                title: "Appeals against Basic and Sijak Verdicts Due Next Week",
                summary:
                  "On that same day the trials are due to continue in the case against Najdan Mladjenovic and Savo Zivkovic for crimes in Bratunac, Edin Dzeko for crimes in Trusina and Jablanica, as well as Ivan Zelenika, Srecko Herceg, Edib Buljubasic, Ivan Medic and Marina Grubisic-Fejzic, who are charged with crimes in Dretelj.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/witness-says-he-is-not-capable-of-testifying",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-11-28T00:00:00.000+00:00",
                title: "Witness Says He is not Capable of Testifying",
                summary:
                  "This witness was due to testify in defence of indictee Dzeko, former member of “Zulfikar” Squad with the Army of Bosnia and Herzegovina, ABiH. Vasvija Vidovic, Defence attorney of indictee Dzeko, said that she stuck to her request for examination of this witness. “We would not insist of examining him, if he were not the direct eyewitness of the event charged upon Dzeko,” Vidovic said, adding that, in his previous statements the witness did not mention that he was not capable of testifying. Dzeko is on trial for committing murders of Croats in Trusina on April 16, 1993. The trial is due to continue on December 10, when indictee Dzeko will testify in his defence.",
                keywordsMatched: [""],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/dzeko-says-he-s-not-murderer",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2013-12-12T00:00:00.000+00:00",
                title: null,
                summary:
                  "Former Bosnian Army serviceman Edin Dzeko told his own trial that witnesses who said he took part in the execution of several Croats in the village of Trusina near Konjic in 1993 were lying. Dzeko, a former member of the Bosnian Army's Zulfikar detachment, is charged with taking part in the execution of civilians and imprisoned fighters from the Croatian Defence Council, along with other members of his unit, on April 16, 1993. According to Dzeko, Bosnian Army troops went into action on the morning of April 16 after their foes opened fire first.",
                keywordsMatched: ["charged with"],
              },
              {
                originalUrl:
                  "http://www.justice-report.com/en/articles/seven-indictees-due-to-enter-pleas-next-week",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-02-17T00:00:00.000+00:00",
                title: null,
                summary:
                  "The source contains media information about the subject.",
                keywordsMatched: [""],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3161&jezik=e",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020505000/0020500489.pdf",
                keywords: ["LF"],
                creationDate: "2014-03-21T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl: "http://www.sudbih.gov.ba/?id=3191&jezik=e#",
                c6Url:
                  "https://secure.c6-intelligence.com/c6images/0020510000/0020509785.pdf",
                keywords: ["LF"],
                creationDate: "2014-04-07T00:00:00.000+00:00",
                title: null,
                summary: null,
                keywordsMatched: [],
              },
              {
                originalUrl:
                  "http://www.balkaninsight.com/en/article/edin-dzeko-sentenced-to-12-years-in-prison",
                c6Url: "",
                keywords: ["AM"],
                creationDate: "2014-06-30T00:00:00.000+00:00",
                title:
                  "osniak Soldier Jailed for Killing Croats in Trusina :: Balkan Insight",
                summary:
                  "The court in Sarajevo on Friday convicted Dzeko, a former member of the Bosnian Army's Zulfikar Squad, of involvement in the execution of six Croatian Defence Council fighters and the murder of a married couple during an attack on Trusina on April 16, 1993. He cited the testimony of one prosecution witness, Rasema Handanovic, a former member of the Zulfikar Squad who was also jailed for crimes committed during the Trusina attack who said that she saw the Dzeko during the execution. “Rasema Handanovic said that Dzeko was standing at her right side when the shooting began,” he said. The court did not accept the prosecution's claim that the fighters who were killed were civilians, or the claim that Dzeko could not have participated in the execution because he had driven some of his wounded comrades out of Trusina before it happened. “The chamber established that he participated in the transportation of the wounded, but that he was also present during the very act of the execution,” Maksumic said. Dzeko was also sentenced to seven years in prison for killing married couple Ilija and Andja Ivankovic in Trusina, and the court ordered a combined sentence of 12 years for both convictions. However Dzeko was acquitted of the illegal arrest and detention of Croatian civilians at the Zulfikar Squad's base in Donja Jablanica in September 1993, as well as beatings and looting in the town of Jablanica in the second half of 1993. The judge explained that Dzeko, as an ordinary soldier, was obeying orders given by a military police officer who had the list of people to be arrested. Dzeko was also acquitted of taking money from victims and of ordering three other soldiers to beat a man with wooden bars and concrete blocks. The fact that Dzeko has a family, that he was young when the crime was committed and that he acted correctly during the trial was taken into account by the court as mitigating circumstances. His trial started in 2012 after he was extradited from the United States the previous year.",
                keywordsMatched: [
                  "jailed",
                  "sentence",
                  "detention",
                  "arrested",
                  "arrest",
                  "prosecution",
                  "illegal",
                ],
              },
            ],
            connections: [
              {
                name: "Sefer Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "149737",
              },
              {
                name: "Rasim Delic",
                association: "Army of Bosnia and Herzegovina",
                personId: "560798",
              },
              {
                name: "Suad Kapic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2342755",
              },
              {
                name: "Emir Mustafic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2369881",
              },
              {
                name: "Adil Ruznic",
                association: "Army of Bosnia and Herzegovina",
                personId: "2390959",
              },
              {
                name: "Nihad Bojadzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3088090",
              },
              {
                name: "Mehura Selimovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189355",
              },
              {
                name: "Alija Osmic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189403",
              },
              {
                name: "Senad Hakalovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189563",
              },
              {
                name: "Nedzad Hodzic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189565",
              },
              {
                name: "Mensur Memic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189568",
              },
              {
                name: "Dzevad Salcin",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189575",
              },
              {
                name: "Zulfikar Alispago",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189583",
              },
              {
                name: "Rasema Handanovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3189585",
              },
              {
                name: "Eso Macic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3392995",
              },
              {
                name: "Osman Sego",
                association: "Army of Bosnia and Herzegovina",
                personId: "3396470",
              },
              {
                name: "Nezir Kazic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3707226",
              },
              {
                name: "Azemin Sadikovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "3914281",
              },
              {
                name: "Osman Brkan",
                association: "Army of Bosnia and Herzegovina",
                personId: "3962603",
              },
              {
                name: "Vehid Subotic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4018155",
              },
              {
                name: "Nusret Guso",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050356",
              },
              {
                name: "Mirsad Suljagic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4050359",
              },
              {
                name: "Muhamed Adzem",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051089",
              },
              {
                name: "Suljo Karkelj",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051091",
              },
              {
                name: "Senad Halilovic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051093",
              },
              {
                name: "Omer Ugljesa",
                association: "Army of Bosnia and Herzegovina",
                personId: "4051096",
              },
              {
                name: "Zehrudin Scuk",
                association: "Army of Bosnia and Herzegovina",
                personId: "4099408",
              },
              {
                name: "Asim Kadic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4177209",
              },
              {
                name: "Izet Hujic",
                association: "Army of Bosnia and Herzegovina",
                personId: "4198965",
              },
              {
                name: "Ibrahim Ceco",
                association: "Army of Bosnia and Herzegovina",
                personId: "4245297",
              },
            ],
            status: "POSITIVE",
            name: "Edin Dzeko",
            gender: "MALE",
            dateOfBirth: "1972-03-14T00:00:00.000+00:00",
            yearOfBirth: 1972,
            nationality: "Bosnian",
            nationalityCode: "BA",
            placeOfBirth: null,
            isPep: false,
            isSanctionsCurrent: false,
            isSanctionsPrevious: false,
            isFinancialRegulator: false,
            isDisqualifiedDirector: false,
            isInsolvent: false,
            isAdverseMedia: true,
            isLawEnforcement: true,
            pepLevel: null,
            personId: "3543895",
            imageThumbnail:
              "https://secure.c6-intelligence.com/c6images/0020170000/0020169101.jpg",
            sanctions: [],
            linkedBusinesses: [
              {
                businessId: "724411",
                businessName: "Army of Bosnia and Herzegovina",
                position: "Former Member",
              },
            ],
            linkedPersons: [],
            hasNewChanges: false,
            keywords: ["LF", "AM"],
          },
          reScreeningEditable: true,
          blacklistMatched: false,
        },
        kycBlacklist: {
          id: 4,
          createdAt: "2021-09-13T07:06:31.000+00:00",
          updatedAt: "2021-09-13T07:06:31.000+00:00",
          blacklistId: "BLC00004",
          fullName: "Dzeko Ed Sc",
          categories: [
            {
              id: 1,
              createdAt: "2021-08-10T15:02:29.963+00:00",
              updatedAt: "2021-08-10T15:02:29.963+00:00",
              name: "Category 1",
              type: "KYC",
              shortName: "C-BL",
            },
            {
              id: 1,
              createdAt: "2021-08-10T15:02:29.963+00:00",
              updatedAt: "2021-08-10T15:02:29.963+00:00",
              name: "Category 1",
              type: "KYC",
              shortName: "C1-BL",
            },
            {
              id: 1,
              createdAt: "2021-08-10T15:02:29.963+00:00",
              updatedAt: "2021-08-10T15:02:29.963+00:00",
              name: "Category 1",
              type: "KYC",
              shortName: "C1B-BL",
            },
          ],
          nationality: "IT",
          dateOfBirth: null,
          yearOfBirth: null,
          gender: "MALE",
          countryOfResidence: "IT",
          idIssuingCountry: null,
          placeOfBirth: null,
          email: null,
          phone: null,
          address: null,
          furtherInformation: null,
          isActive: true,
          kycMatchedAt: null,
          clientType: "USER",
        },
        status: "FALSE",
      },
    ],
    // positiveMatch: null
    positiveMatch: {
      id: 8854,
      createdAt: "2021-05-24T10:18:30.087+00:00",
      updatedAt: "2021-05-28T04:51:00.472+00:00",
      matchId: "M01",
      keyData: {
        aliases: [
          {
            title: null,
            alternateTitle: null,
            name: " Hello Kitty",
          },
          {
            title: null,
            alternateTitle: null,
            name: "Rayane Nazareth",
          },
          {
            title: null,
            alternateTitle: null,
            name: "Rayane Nazareth Cardozo",
          },
          {
            title: null,
            alternateTitle: null,
            name: "Rayane Nazareth Cardozo da Silveira",
          },
          {
            title: null,
            alternateTitle: null,
            name: "Rayane Nazareth Cardozo da Silveira",
          },
          {
            title: null,
            alternateTitle: null,
            name: "Rayane Oliveira",
          },
        ],
        email: "",
        telephone: "",
        website: null,
        addresses: ["Sao Goncalo, Rio de Janeiro, Brazil"],
      },
      furtherInformation: {
        politicalPositions: [],
        notes: [
          "Rep. Risk: Organised Crime - Traffic and Distribution of Narcotics",
        ],
      },
      sources: [
        {
          originalUrl:
            "https://www.osaogoncalo.com.br/seguranca-publica/77611/vinte-anos-e-hello-kitty-estao-na-mira-da-pm-no-salgueiro",
          c6Url: "",
          keywords: ["AM"],
          creationDate: "2020-01-24T00:00:00.000+00:00",
          title:
            "''Vinte anos'' and ''Hello Kitty'' are wanted by the military police in Salgueiro",
          summary:
            "On 20 January 2020, the Military police launched an operation to track down the Brazilian narcotrafficker Rayane Nazareth Cardozo da Silveira. She is a member of the large criminal organization First Capital Command and controls the drug trafficking in Sao Goncalo, Rio de Janeiro state. There is no information as of her whereabouts yet.\n\nSource: O Sao Goncalo, 20 January 2020\nThe source provides personal identification details of the subject. Please refer to the Details section of the profile.",
          keywordsMatched: ["drug trafficking", "narcotrafficker", "criminal"],
        },
        {
          originalUrl:
            "https://www.osaogoncalo.com.br/seguranca-publica/60050/hello-kitty-desafia-a-policia-em-suas-redes-sociais",
          c6Url: "",
          keywords: [],
          creationDate: "2020-01-24T00:00:00.000+00:00",
          title: null,
          summary:
            "The source provides personal identification details of the subject. Please refer to the Details section of the profile.",
          keywordsMatched: [""],
        },
      ],
      connections: [
        {
          name: "Marcos Willians Herbas Camacho",
          association: "First Capital Command",
          personId: "782972",
        },
        {
          name: "Alexander  Pareja Garcia",
          association: "First Capital Command",
          personId: "2012886",
        },
        {
          name: "William  Rosales Suarez",
          association: "First Capital Command",
          personId: "2030083",
        },
        {
          name: "Carlos Antonio Caballero",
          association: "First Capital Command",
          personId: "3315661",
        },
        {
          name: "Pedro Paulo Quevedo Medina",
          association: "First Capital Command",
          personId: "3453157",
        },
        {
          name: "Emiliano Rojas Gimenez",
          association: "First Capital Command",
          personId: "3562794",
        },
        {
          name: "Maximiliano Dorado",
          association: "First Capital Command",
          personId: "3645055",
        },
        {
          name: "William  Arevalos",
          association: "First Capital Command",
          personId: "3750677",
        },
        {
          name: "Sebastiao  Spencer",
          association: "First Capital Command",
          personId: "3881275",
        },
        {
          name: "Ezequiel  Dorado",
          association: "First Capital Command",
          personId: "3881277",
        },
        {
          name: "Ozzie  Dorado Lozadas",
          association: "First Capital Command",
          personId: "3881278",
        },
        {
          name: "Carlos  Palomino",
          association: "First Capital Command",
          personId: "3916281",
        },
        {
          name: "Amadeo  Parra Moreno",
          association: "First Capital Command",
          personId: "3916283",
        },
        {
          name: "Dumar Fabian Gonzales",
          association: "First Capital Command",
          personId: "3916285",
        },
        {
          name: "Alejandro Juvenal Herbas Camacho",
          association: "First Capital Command",
          personId: "4024540",
        },
        {
          name: "Marcio Henrique Garcia dos Santos",
          association: "First Capital Command",
          personId: "4880777",
        },
        {
          name: "Hugo Rene Ayala Henry Bastos",
          association: "First Capital Command",
          personId: "5364589",
        },
        {
          name: "Rogerio Jeremias de Simone",
          association: "First Capital Command",
          personId: "5446446",
        },
        {
          name: "Fabiano Alves de Souza",
          association: "First Capital Command",
          personId: "5446470",
        },
        {
          name: "Roni Franca de Jesus",
          association: "First Capital Command",
          personId: "5922923",
        },
        {
          name: "Angelo Goncalves de Miranda",
          association: "First Capital Command",
          personId: "5923000",
        },
        {
          name: "Mauro Pereira da Silva",
          association: "First Capital Command",
          personId: "5923082",
        },
        {
          name: "Alex Araujo Claudino",
          association: "First Capital Command",
          personId: "6684046",
        },
        {
          name: "Rodrigo Araujo Claudino",
          association: "First Capital Command",
          personId: "6684065",
        },
        {
          name: "Adajilson Maciano Da Silva",
          association: "First Capital Command",
          personId: "6936742",
        },
        {
          name: "Adriano Alcantara De Oliveira",
          association: "First Capital Command",
          personId: "6936746",
        },
        {
          name: "Alexandre Cardoso",
          association: "First Capital Command",
          personId: "6936749",
        },
        {
          name: "Andre Willian Barbosa",
          association: "First Capital Command",
          personId: "6936750",
        },
        {
          name: "Antonio Carlos De Sousa Santos",
          association: "First Capital Command",
          personId: "6936753",
        },
        {
          name: "Audelanio Soares Ferreira",
          association: "First Capital Command",
          personId: "6936759",
        },
        {
          name: "Bruno Cesar Leal Da Costa",
          association: "First Capital Command",
          personId: "6936764",
        },
        {
          name: "Carlos Alberto Bortolin",
          association: "First Capital Command",
          personId: "6936767",
        },
        {
          name: "Daniel De Oliveira Amancio Amat",
          association: "First Capital Command",
          personId: "6936768",
        },
        {
          name: "Danilo Roberto Azevedo Villani",
          association: "First Capital Command",
          personId: "6936772",
        },
        {
          name: "Dаrio Satilite",
          association: "First Capital Command",
          personId: "6936779",
        },
        {
          name: "Denis Martins Iachelli",
          association: "First Capital Command",
          personId: "6936783",
        },
        {
          name: "Dheyson Rene Ancelmo Mattos",
          association: "First Capital Command",
          personId: "6936789",
        },
        {
          name: "Diego Leriam Pezzonia",
          association: "First Capital Command",
          personId: "6936793",
        },
        {
          name: "Edson Luiz Santana Machado",
          association: "First Capital Command",
          personId: "6936802",
        },
        {
          name: "Fabio Martins Ferreira",
          association: "First Capital Command",
          personId: "6936807",
        },
        {
          name: "Fabio Rodrigues Henrique",
          association: "First Capital Command",
          personId: "6936816",
        },
        {
          name: "Felipe Marinho Rici Novais",
          association: "First Capital Command",
          personId: "6936819",
        },
        {
          name: "Fellipe Vidolim Cinti",
          association: "First Capital Command",
          personId: "6936823",
        },
        {
          name: "Fernando Yukio Okuma",
          association: "First Capital Command",
          personId: "6936830",
        },
        {
          name: "Flavio Alves Nunes",
          association: "First Capital Command",
          personId: "6936836",
        },
        {
          name: "Gibson Inacio Tavares",
          association: "First Capital Command",
          personId: "6936840",
        },
        {
          name: "Gilson Carlos Rodrigues Da Silva",
          association: "First Capital Command",
          personId: "6936842",
        },
        {
          name: "Glauco Pradella Teixeira Da Cunha",
          association: "First Capital Command",
          personId: "6936845",
        },
        {
          name: "Graciele Da Silva Santos",
          association: "First Capital Command",
          personId: "6939493",
        },
        {
          name: "Herwerton Araujo De Oliveira",
          association: "First Capital Command",
          personId: "6939496",
        },
        {
          name: "Heverton Nascimento Neves",
          association: "First Capital Command",
          personId: "6939500",
        },
        {
          name: "Islei Da Silva Braz",
          association: "First Capital Command",
          personId: "6939504",
        },
        {
          name: "Jeferson Aiza De Souza",
          association: "First Capital Command",
          personId: "6939508",
        },
        {
          name: "Joao Martins Tangerino",
          association: "First Capital Command",
          personId: "6939511",
        },
        {
          name: "Jorge Eduardo De Oliveira",
          association: "First Capital Command",
          personId: "6939524",
        },
        {
          name: "Jose Da Silva Oliveira",
          association: "First Capital Command",
          personId: "6939526",
        },
        {
          name: "Luan Carlos De Almeida",
          association: "First Capital Command",
          personId: "6939543",
        },
        {
          name: "Lucas Moreira Pires",
          association: "First Capital Command",
          personId: "6939553",
        },
        {
          name: "Luis Antonio Lobo Cardoso",
          association: "First Capital Command",
          personId: "6939556",
        },
        {
          name: "Matheus Moreira Pires",
          association: "First Capital Command",
          personId: "6939565",
        },
        {
          name: "Michel Barbosa Coelho",
          association: "First Capital Command",
          personId: "6942249",
        },
        {
          name: "Mike Reno De Souza Rocha",
          association: "First Capital Command",
          personId: "6942253",
        },
        {
          name: "Moacir Eduardo De Miranda",
          association: "First Capital Command",
          personId: "6942256",
        },
        {
          name: "Naue Oliveira Cortes",
          association: "First Capital Command",
          personId: "6942258",
        },
        {
          name: "Rafael da Silva",
          association: "First Capital Command",
          personId: "6942267",
        },
        {
          name: "Rafael Dias Do Nascimento Vieira",
          association: "First Capital Command",
          personId: "6942269",
        },
        {
          name: "Reginaldo Da Costa Ferreira",
          association: "First Capital Command",
          personId: "6942274",
        },
        {
          name: "Ricardo Varela Reboredo",
          association: "First Capital Command",
          personId: "6942277",
        },
        {
          name: "Rudney Lopes De Souza",
          association: "First Capital Command",
          personId: "6942295",
        },
        {
          name: "Thiago Farias",
          association: "First Capital Command",
          personId: "6942299",
        },
        {
          name: "Tiago Lucas Alves",
          association: "First Capital Command",
          personId: "6942304",
        },
        {
          name: "Wagner Ferreira De Barros",
          association: "First Capital Command",
          personId: "6942305",
        },
        {
          name: "Elton Leonel Rumich da Silva",
          association: "First Capital Command",
          personId: "8102497",
        },
        {
          name: "Juliano de Lima Teixeira",
          association: "First Capital Command",
          personId: "8525997",
        },
        {
          name: "Francisco Marcio Teixeira Perdigao",
          association: "First Capital Command",
          personId: "8547520",
        },
        {
          name: "Severino Ferreira",
          association: "First Capital Command",
          personId: "8667183",
        },
        {
          name: "Edson Maradona Maia",
          association: "First Capital Command",
          personId: "8689668",
        },
        {
          name: "Gilvan de Cunhan Moreira",
          association: "First Capital Command",
          personId: "8779941",
        },
        {
          name: "Hendrya Larrissa Dos Santos Souza",
          association: "First Capital Command",
          personId: "8779944",
        },
        {
          name: "Richard Arquimedes Cabrera Marrera",
          association: "First Capital Command",
          personId: "8779956",
        },
        {
          name: "Alessandro Luiz Vieira Moura",
          association: "First Capital Command",
          personId: "8781593",
        },
        {
          name: "Gilberto Aparecido dos Santos",
          association: "First Capital Command",
          personId: "8803562",
        },
        {
          name: "Lucas Resendi Saraiva",
          association: "First Capital Command",
          personId: "8837603",
        },
        {
          name: "Glauciano Alves Ferreira",
          association: "First Capital Command",
          personId: "8889802",
        },
        {
          name: "Carolina Imaculada Mendes de Andrade",
          association: "First Capital Command",
          personId: "8889919",
        },
        {
          name: "Luana De Almeida Domingos",
          association: "First Capital Command",
          personId: "8893373",
        },
        {
          name: "Jesuilson Pereira Gomez",
          association: "First Capital Command",
          personId: "8896648",
        },
        {
          name: "Marivaldo Antonio da Silva",
          association: "First Capital Command",
          personId: "8905088",
        },
        {
          name: "Joelcio Marques de Souza",
          association: "First Capital Command",
          personId: "8905456",
        },
        {
          name: "Edgar dos Santos Silva",
          association: "First Capital Command",
          personId: "8905557",
        },
        {
          name: "Livaldo Jose da Silva",
          association: "First Capital Command",
          personId: "9006692",
        },
        {
          name: "Diego Goncalves Ferreira",
          association: "First Capital Command",
          personId: "9277795",
        },
        {
          name: "Sergio de Arruda Quintiliano",
          association: "First Capital Command",
          personId: "9548317",
        },
        {
          name: "Andre de Oliveira Macedo",
          association: "First Capital Command",
          personId: "10221111",
        },
        {
          name: "Luma Valeria Rovagnollo",
          association: "First Capital Command",
          personId: "10290609",
        },
        {
          name: "Wesley Aparecido Eugenio Silva",
          association: "First Capital Command",
          personId: "10290637",
        },
        {
          name: "Giovanni Barbosa da Silva",
          association: "First Capital Command",
          personId: "10520481",
        },
        {
          name: "Italo Conceicao da Silva",
          association: "First Capital Command",
          personId: "10586817",
        },
        {
          name: "Rodrigo Braga",
          association: "First Capital Command",
          personId: "10663922",
        },
        {
          name: "Weslley Neres Dos Santos",
          association: "First Capital Command",
          personId: "10675856",
        },
        {
          name: "Bruno Cesar Pereira",
          association: "First Capital Command",
          personId: "10675863",
        },
        {
          name: "Alfredo Gimenes Lorrea",
          association: "First Capital Command",
          personId: "10675866",
        },
        {
          name: "Bruno Rafael Porto de Oliveira",
          association: "First Capital Command",
          personId: "10675870",
        },
        {
          name: "Maxlese Rodrigues",
          association: "First Capital Command",
          personId: "10675879",
        },
        {
          name: "Wiilian Meira do Nascimento",
          association: "First Capital Command",
          personId: "10675882",
        },
        {
          name: "Yoni Gomez Gimenez",
          association: "First Capital Command",
          personId: "10675947",
        },
        {
          name: "Jonathan Rodrigo",
          association: "First Capital Command",
          personId: "10675953",
        },
        {
          name: "Ramires Alvarez",
          association: "First Capital Command",
          personId: "10675955",
        },
        {
          name: "Vicente Silva Cristaldo",
          association: "First Capital Command",
          personId: "10675958",
        },
        {
          name: "Benigno Jara Alvarez",
          association: "First Capital Command",
          personId: "10675961",
        },
        {
          name: "Nelson Gustavo Amarillo Elizeche",
          association: "First Capital Command",
          personId: "10675966",
        },
        {
          name: "Rodrigo Ariel Acosta",
          association: "First Capital Command",
          personId: "10675969",
        },
        {
          name: "Pedro Pablo Gauto",
          association: "First Capital Command",
          personId: "10675970",
        },
        {
          name: "Sergio Gomez Gimenez",
          association: "First Capital Command",
          personId: "10675979",
        },
        {
          name: "Vinicius Henrique da Silva Oliveira",
          association: "First Capital Command",
          personId: "10766891",
        },
        {
          name: "Jailson Ferreira da Silva",
          association: "First Capital Command",
          personId: "10766895",
        },
        {
          name: "Wilson Decaria",
          association: "First Capital Command",
          personId: "10806022",
        },
        {
          name: "Carlos Eduardo de Almada Santos",
          association: "First Capital Command",
          personId: "10954098",
        },
        {
          name: "Estevao Barbosa de Miranda",
          association: "First Capital Command",
          personId: "10954104",
        },
        {
          name: "Zaelton Moreno Batista",
          association: "First Capital Command",
          personId: "10954112",
        },
        {
          name: "Rivanildo Moreno da Luz",
          association: "First Capital Command",
          personId: "10954117",
        },
        {
          name: "Alessandro Nogueira da Silva",
          association: "First Capital Command",
          personId: "10954120",
        },
        {
          name: "Matheus Gustavo Silva",
          association: "First Capital Command",
          personId: "10964239",
        },
        {
          name: "Jefferson Cleiton Silva",
          association: "First Capital Command",
          personId: "10964240",
        },
        {
          name: "Aurilene Correia",
          association: "First Capital Command",
          personId: "10964245",
        },
        {
          name: "Erica Cristina Abadias",
          association: "First Capital Command",
          personId: "10964247",
        },
        {
          name: "Indeomar Pereira",
          association: "First Capital Command",
          personId: "10964249",
        },
        {
          name: "Marcia Oliveira",
          association: "First Capital Command",
          personId: "10964251",
        },
        {
          name: "Dijon Cruz",
          association: "First Capital Command",
          personId: "10964253",
        },
        {
          name: "Marcelo de Almeida",
          association: "First Capital Command",
          personId: "10964254",
        },
        {
          name: "Nelio Filho",
          association: "First Capital Command",
          personId: "10964255",
        },
        {
          name: "Daniel Silva",
          association: "First Capital Command",
          personId: "10964257",
        },
      ],
      status: "POSITIVE",
      name: "Rayane Nazareth Cardozo da Silveira",
      gender: "FEMALE",
      dateOfBirth: null,
      yearOfBirth: 2000,
      nationality: "Brazilian",
      nationalityCode: "BR",
      placeOfBirth: null,
      isPep: false,
      isSanctionsCurrent: false,
      isSanctionsPrevious: false,
      isFinancialRegulator: false,
      isDisqualifiedDirector: false,
      isInsolvent: false,
      isAdverseMedia: true,
      isLawEnforcement: false,
      pepLevel: null,
      personId: "8781587",
      imageThumbnail:
        "https://secure.c6-intelligence.com/c6images/ari0202004/B6Iyyw9C.PNG",
      sanctions: [],
      linkedBusinesses: [
        {
          businessId: "411572",
          businessName: "First Capital Command",
          position: "Member",
        },
      ],
      linkedPersons: null,
      keywords: ["AM"],
    },
    statusChangedBy: {
      id: 1648,
      createdAt: "2021-07-06T08:53:48.867+00:00",
      updatedAt: "2021-07-06T08:53:48.867+00:00",
      createdBy: {
        id: 2,
        firstName: "Justin",
        lastName: "",
        email: "justin@islandpeakcloud.sg",
        colorCode: null,
        avatar: null,
      },
      lastModifiedBy: {
        id: 2,
        firstName: "Justin",
        lastName: "",
        email: "justin@islandpeakcloud.sg",
        colorCode: null,
        avatar: null,
      },
      eventType: "REJECT",
      tableName: "KycRequest",
      payload: {
        to: "REJECTED",
        from: "COMPLETED",
        refId: "KYC00092",
        noteId: null,
      },
    },
    // status: "APPROVED"
    status: "REJECTED",
    //status: "COMPLETED"
  },
  scoring: {
    id: 1,
    createdAt: null,
    updatedAt: "2021-04-07T05:03:17.354+00:00",
    createdBy: null,
    lastModifiedBy: null,
    name: "Default",
    description: "Default Settings",
    isEnabledActive: true,
    isActive: true,
    fatfPepScore: {
      fatfScore: {
        NonFatf: 30,
        HighRisk: 50,
        Apg: 25,
        NoInformation: 100,
        Blacklist: 75,
        Members: 0,
      },
      pepScore: {
        TierThree: 25,
        NotPep: 0,
        TierTwo: 75,
        TierOne: 100,
        TierFour: 0,
      },
    },
    weightSetting: {
      isPersonSanction: true,
      isCountrySanction: true,
      pepScoreSetting: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      previouslySanction: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      financialRegulator: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      lawEnforcement: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      adverseMedia: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      fatfResidence: {
        weight: 10,
        rebase: 4,
        isActive: true,
      },
      baselResidence: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      cpiResidence: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      fatfGoverment: {
        weight: 10,
        rebase: 4,
        isActive: true,
      },
      baselGoverment: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      cpiGoverment: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      fatfNationality: {
        weight: 10,
        rebase: 4,
        isActive: true,
      },
      baselNationality: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
      cpiNationality: {
        weight: 20,
        rebase: 8,
        isActive: true,
      },
    },
    otherSetting: {
      lowScore: 30,
      mediumScore: 70,
      highScore: 100,
      lowReScreening: 12,
      mediumReScreening: 6,
      highReScreening: 3,
    },
  },
  chartSetting:
    "data:image/png;base64,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SIAESIAEzCNAwWAeW1omARIgARIgARIgARIgAdsToGCw/RJyAiRAAiRAAiRAAiRAAiRgHgEKBvPY0jIJkAAJkAAJkAAJkAAJ2J4ABYPtl5ATIAESIAESIAESIAESIAHzCFAwmMeWlkmABEiABEiABEiABEjA9gQoGGy/hJwACZAACZAACZAACZAACZhHgILBPLa0TAIkQAIkQAIkQAIkQAK2J0DBYPsl5ARIgARIgARIgARIgARIwDwCFAzmsaVlEiABEiABEiABEiABErA9AQoG2y8hJ0ACJEACJEACJEACJEAC5hGgYDCPLS2TAAmQAAmQAAmQAAmQgO0JUDDYfgk5ARIgARIgARIgARIgARIwjwAFg3lsaZkESIAESIAESIAESIAEbE+AgsH2S8gJkAAJkAAJkAAJkAAJkIB5BCgYzGNLyyRAAiRAAiRAAiRAAiRgewIUDLZfQk6ABEiABEiABEiABEiABMwjQMFgHltaJgESIAESIAESIAESIAHbE6BgsP0ScgIkQAIkQAIkQAIkQAIkYB4BCgbz2NIyCZAACZAACZAACZAACdieAAWD7ZeQEyABEiABEiABEiABEiAB8whQMJjHlpZJgARIgARIgARIgARIwPYEKBhsv4ScAAmQAAmQAAmQAAmQAAmYR4CCwTy2tEwCJEACJEACJEACJEACtidAwWD7JeQESIAESIAESIAESIAESMA8AhQM5rGlZRIgARIgARIgARIgARKwPQEKBtsvISdAAiRAAiRAAiRAAiRAAuYRoGAwjy0tkwAJkAAJkAAJkAAJkIDtCVAw2H4JOQESIAESIAESIAESIAESMI8ABYN5bGmZBEiABEiABEiABEiABGxPgILB9kvICZAACZAACZAACZAACZCAeQQoGMxjS8skQAIkQAIkQAIkQAIkYHsCFAy2X0JOgARIgARIgARIgARIgATMI0DBYB5bWiYBEiABEiABEiABEiAB2xOgYLD9EnICJEACJEACJEACJEACJGAeAQoG89jSMgmQAAmQAAmQAAmQAAnYngAFg+2XkBMgARIgARIgARIgARIgAfMIUDCYx5aWSYAESIAESIAESIAESMD2BCgYbL+EnAAJkAAJkAAJkAAJkAAJmEeAgsE8trRMAiRAAiRAAiRAAiRAArYnQMFg+yXkBEiABEiABEiABEiABEjAPAIUDOaxpWUSIAESIAESIAESIAESsD0BCgbbLyEnQAIkQAIkQAIkQAIkQALmEaBgMI8tLZMACZAACZAACZAACZCA7QlQMNh+CTkBEiABEiABEiABEiABEjCPAAWDeWxpmQRIgARIgARIgARIgARsT+D/Acn/p5XyvjW9AAAAAElFTkSuQmCC",
  chartKyc:
    "data:image/png;base64,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",
  me: {
    id: 2,
    createdAt: "2020-11-25T05:03:14.830+00:00",
    updatedAt: "2021-01-20T10:19:14.817+00:00",
    createdBy: {
      id: 1,
      firstName: "Admin",
      lastName: "4",
      email: "admin@regtank.com",
      colorCode: null,
      avatar: null,
    },
    lastModifiedBy: {
      id: 1,
      firstName: "Admin",
      lastName: "4",
      email: "admin@regtank.com",
      colorCode: null,
      avatar: null,
    },
    company: "Regtank UAT",
    paymentFrequency: "ANNUAL",
    usedPackage: {
      id: 1,
      name: "Basic package",
      description: "Basic package for testing",
      kycCost: 3,
      kytCost: 2,
      monthly: {
        price: 999,
        credits: 1000,
      },
      quarterly: {
        price: 999,
        credits: 3000,
      },
      biAnnual: {
        price: 999,
        credits: 5000,
      },
      annual: {
        price: 999,
        credits: 10000,
      },
      isCurrent: false,
      usedPackagePeriod: null,
    },
  },
};
