export let array = [
    {
      id: 1,
      name: "CEO",
      salary: 200000,
      subordinates: [
        {
          id: 2,
          name: "CTO",
          salary: 150000,
          subordinates: [
            {
              id: 3,
              name: "Dev Manager",
              salary: 120000,
              subordinates: [
                {
                  id: 4,
                  name: "Senior Dev",
                  salary: 100000,
                  subordinates: [],
                },
              ],
            },
          ],
        },
        {
          id: 5,
          name: "CFO",
          salary: 140000,
          subordinates: [],
        },
      ],
    },
  ];