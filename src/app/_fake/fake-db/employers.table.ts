export class EmployersTable {
    public static employers: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        employerName: 'TriCity Medical Center', 
        city: "Oceanside", 
        state: "CA"
      }
    ];

    public static audits: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        title: 'Test Audit',
        purpose: 'Joint Commission',
        description: '',
        isRandom: 0,
        employeeCount: 100,
        employeeFilter: '',
        startDate: '',
        completeDate: '',
        initialScore: 0,
        createdBy: '',
        updatedBy: '',
        isActive: 1,
      }
    ];

    public static users: any = [
      {
        id: '', 
        employerId: '', 
        userId: '', 
        jobTitle: '', 
        
        createdBy: '',
        updatedBy: '',
        isActive: 1,
      }
    ];

    public static employees: any = [
      {
        id: '', 
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
        userId: '', 
        employeeNumber: '', 
        startDate: '', 
        endDate: '', 
        jobTitle: '', 
        departmentId: '', 
        locationId: '', 
        supervisorId: '', 
        professionId: '', 
        jobType: 1, //perm, travel, pd
        agencyId: '', 
        agencyRecruiterId: '', 
        shift: '', 
        jobId: '', 
        statusCode: 1, 
        createdBy: '',
        updatedBy: '',
        isActive: 1,
      }
    ];

    public static departments: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f0', 
        employerId: '05cfe1bc-477b-4a77-ac79-531c9741e84e', 
        departmentName: 'NICU', 
        costCenterCode: '0001', 
        description: 'babies, babies, babies'
      }
    ];

    public static doctypes: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f0', 
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
        documentTypesId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
        documentName: 'Drivers License'
      }
    ];
    public static docrules: any = [
      {
        id: '',
        employerDocTypesId: '15a42185-a46a-40f4-b7f2-608d3dc035f0',
        professionId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        specialtyId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        departmentId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        locationId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        title: 'blah blah rule',
        description: '',
        ruleQuery: '',
        ruleConfig: '',
        createdBy: '',
        updatedBy: '',
        statusCode: 1,
        isActive: 1,
        isSystem: 1
      }
    ]

    public static jobs: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f0', 
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
        jobTitle: 'RN', 
        location: 'San Diego, CA', 
        startDate: '2/1/2021',
        description: 'job details here'
      }
    ];

    public static contracts: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f3', 
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4', 
        agencyId: '15a42185-a46a-40f4-b7f2-608d3dc035f8', 
        startDate: '1/1/2020', 
        endDate: '12/31/2021'
      }
    ];

    public static locations: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-608d3dc035f1', 
        employerId: '15a42185-a46a-40f4-b7f2-608d3dc035f4',
        locationName: 'Tri City Medical Center - Chula Vista', 
        city: 'Chula Vista', 
        state: 'CA', 
        bedCount: 10, 
        totalFTE: 100
      }
    ];
  }
  