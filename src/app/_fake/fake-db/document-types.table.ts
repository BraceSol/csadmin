export class DocumentTypesTable {
    public static categories: any = [
      {
        id: '15a42185-f46a-40f4-b7f2-308d3dc035f4',
        industryId: 1,
        categoryName: 'General Documents',
        description: `The Lotus Elise first appeared in 1996 and revolutionised `,
      },
      {
        id: '25a42185-f46a-40f4-b7f2-308d3dc035f4',
        industryId: 1,
        categoryName: 'Certifications',
        description: `The Lotus Elise first appeared in 1996 and `,
      },
    ];

    public static rules: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-308d3dc035f4', 
        documentTypesId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        professionId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        specialtyId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        departmentId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        title: 'Rule #1', 
        description: '', 
        ruleQuery: '', 
        rulesConfig: [{}], 
        createdOn: '', 
        createdBy: '', 
        updatedOn: '', 
        updatedBy: '', 
        statusCode: 1
      }, 
      {
        id: '21a42185-a46a-40f4-b7f2-308d3dc035f4', 
        documentTypesId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        professionId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        specialtyId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        departmentId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        title: 'Rule #2', 
        description: '', 
        ruleQuery: '', 
        rulesConfig: [{}], 
        createdOn: '', 
        createdBy: '', 
        updatedOn: '', 
        updatedBy: '', 
        statusCode: 1
      }
    ];

    public static attributes: any = [
      {
        id: '15a42185-a46a-40f4-b7f2-308d3dc035f4', 
        documentTypesId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        attributeName: 'Issued by State', 
        description: '', 
        attributeType: '', 
        defaultValue: '', 
        maxLength: 100, 
        fieldOptions: {}, 
        createdOn: '', 
        createdBy: '', 
        updatedOn: '', 
        updatedBy: '', 
        statusCode: 1
      }, 
      {
        id: '21a42185-a46a-40f4-b7f2-308d3dc035f4', 
        documentTypesId: '05a42185-f46a-40f4-b7f2-308d3dc035f4', 
        attributeName: 'Expiration Date', 
        description: '', 
        attributeType: '', 
        defaultValue: '', 
        maxLength: 100, 
        fieldOptions: {}, 
        createdOn: '', 
        createdBy: '', 
        updatedOn: '', 
        updatedBy: '', 
        statusCode: 1
      }
    ];

    public static documentTypes: any = [
      {
        id: '05a42185-f46a-40f4-b7f2-308d3dc035f4',
        docCategoryId: '15a42185-f46a-40f4-b7f2-308d3dc035f4', 
        employerId: '', 
        documentName: "Drivers License", 
        description: '', 
        requirementLevel: 1, 
        prefix: '', 
        exampleDocuments: [
          {
            filename : 'tomstestfile.txt', 
            title : 'Toms Test File', 
            description : 'some test file'
          },
          {
            filename : 'tomstestfile2.txt', 
            title : 'Toms Test File 2', 
            description : 'some test file 2'
          }
        ], 
        references: {}, 
        createdOn: '', 
        createdBy: '', 
        updatedOn: '', 
        updatedBy: '', 
        statusCode: 1
      }
    ]
  }