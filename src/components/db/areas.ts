export const areas = [
  {
    id: 2,
    name: 'Sør-Trøndelag/Hedmark',
    count: 119,
    districts: [
      7,
      8,
      9,
      10,
      11
    ]
  },
  {
    id: 3,
    name: 'Nord-Trøndelag',
    count: 168,
    districts: [
      72,
      73,
      74,
      75,
      76,
      77
    ]
  },
  {
    id: 4,
    name: 'Nordland',
    count: 192,
    districts: [
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67,
      68,
      69,
      70,
      71
    ]
  },
  {
    id: 5,
    name: 'Troms',
    count: 177,
    districts: [
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59
    ]
  },
  {
    id: 6,
    name: 'Vest-Finnmark',
    count: 1623,
    districts: [
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      78,
      79,
      80
    ]
  },
  {
    id: 7,
    name: 'Øst-Finnmark',
    count: 942,
    districts: [
      1,
      2,
      3,
      4,
      5,
      6,
      17,
      18,
      19,
      20,
      81
    ]
  }
];
export function getById(id) {
  return areas.find(a => a.id === parseInt(id, 10));
}
export function getAreaByDistrictId(id) {
  return areas.find(a => !!a.districts.find(d => d === parseInt(id,10)));
}


