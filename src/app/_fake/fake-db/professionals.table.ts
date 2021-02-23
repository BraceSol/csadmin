export class ProfessionsTable {
    public static professions: any = [
      {
        id: '15a42185-f46a-40f4-b7f2-308d3dc035f4',
        industryId: 1,
        professionName: 'Registered Nurse',
        description: 'The Lotus Elise first appeared in 1996 and revolutionised : ',
      },
      {
        id: '25a42185-f46a-40f4-b7f2-308d3dc035f4',
        industryId: 1,
        professionName: 'LVN',
        description: 'The Lotus Elise first appeared in 1996 and : ',
      },
    ];

    public static specialties: any = [
      {
        id: '15a42185-f46a-40f4-b7f2-608d3dc035f4',
        industryId: 1,
        specialtyName: 'Specialty1',
        description: 'The Lotus Elise first appeared in 1996 and revolutionised : ',
      },
      {
        id: '25a42185-f46a-40f4-b7f2-608d3dc035f4',
        industryId: 1,
        specialtyName: 'Specialty2',
        description: 'The Lotus Elise first appeared in 1996 and : ',
      },
    ];

    public static reports: any = [
      {
        id: '15a42185-f46a-40f4-b7f2-608d3dc035f4',
        userId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        professionId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        expertiseId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        departmentId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        locationId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        initialScore: 90, 
        currentScore: 95, 
        missingDocs: 2, 
        totalDocs: 22, 
        expiringDocs: 1,
        statusCode: 1, 
        createdBy: '', 
        createdOn: '', 
        updatedBy: '', 
        updatedOn: ''
      }
    ];

    public static documents: any = [
      {
        id: '15a42185-f46a-40f4-b7f2-608d3dc035f4',
        userId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        uploadId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        documentTypesId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        storePath: '', 
        filename: 'tomstestfile1.pdf', 
        statusCode: 1, 
        createdBy: '', 
        createdOn: '', 
        updatedBy: '', 
        updatedOn: ''
      }
    ];

    public static professionals: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        firstName: 'Tom',
        lastName: 'Brown', 
        professionId: '15a42185-f46a-40f4-b7f2-308d3dc035f4', 
        specialtyId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        city: 'Oceanside',
        state: 'CA', 
        lastUpdated: '20020-01-20 11:23:45', 
        workhistory: [
          {
            id: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
            userId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
            employerId: '',
            employerName: 'Toms Test Hospital',
            startDate: '1/1/2020',
            endDate: '1/20/2020',
            employerCity: 'Oceanside',
            employerState: 'CA',
            employerPostalCode: '92057',
            professionId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
            specialtyId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
            facilityTypeCode: 'hospital',
            teachingFacility: 1,
            bedCount: 1,
            jobTypeCode: '',
            reference: '',
            createdBy: '',
            createdOn: '',
            updatedBy: '',
            updatedOn: ''
          }
        ], 
        eduHistory: [
          {
            id: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
            userId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
            schoolId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
            schoolName: 'Toms University', 
            city: 'Clemson', 
            state: 'SC', 
            postalCode: '', 
            degree: 'Nursing', 
            graduationDate: '1/1/2020', 
            createdBy: '', 
            createdOn: '', 
            updatedBy: '', 
            updatedOn: ''
          }
        ]
      },
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        firstName: 'Michele',
        lastName: 'Brown', 
        professionId: '15a42185-f46a-40f4-b7f2-308d3dc035f4', 
        specialtyId: '15a42185-f46a-40f4-b7f2-608d3dc035f4', 
        city: 'Oceanside',
        state: 'CA', 
        lastUpdated: '20020-01-20 11:23:45'
      },
    ];
  }