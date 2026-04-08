const boats = [
  {
    id: '1',
    name: 'Sea Explorer',
    type: 'Sailboat',
    length: '32 ft',
    registrationNumber: 'SB-12345',
    location: 'Marina Bay',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f7',
    lastInspection: '2023-05-15',
    nextInspection: '2024-05-15',
    ownerId: '1'
  },
  {
    id: '2',
    name: 'Wave Rider',
    type: 'Motor Yacht',
    length: '45 ft',
    registrationNumber: 'MY-67890',
    location: 'Harbor Point',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1599233068891-2b081e9d7d0f',
    lastInspection: '2023-06-20',
    nextInspection: '2024-06-20',
    ownerId: '1'
  },
  {
    id: '3',
    name: 'Blue Horizon',
    type: 'Catamaran',
    length: '38 ft',
    registrationNumber: 'CT-24680',
    location: 'Coastal Marina',
    status: 'maintenance',
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f7',
    lastInspection: '2023-04-10',
    nextInspection: '2024-04-10',
    ownerId: '2'
  },
  {
    id: '4',
    name: 'Ocean Breeze',
    type: 'Fishing Boat',
    length: '28 ft',
    registrationNumber: 'FB-13579',
    location: 'Fisherman\'s Wharf',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1568977337289-c0a49bdac5d3',
    lastInspection: '2023-03-05',
    nextInspection: '2024-03-05',
    ownerId: '3'
  },
  {
    id: '5',
    name: 'Sunset Cruiser',
    type: 'Pontoon Boat',
    length: '24 ft',
    registrationNumber: 'PB-97531',
    location: 'Lake Shore Marina',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f7',
    lastInspection: '2023-07-12',
    nextInspection: '2024-07-12',
    ownerId: '3'
  }
];

module.exports = boats;
