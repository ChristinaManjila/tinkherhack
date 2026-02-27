const pets = [
    { 
        id: 1, name: "Luna", species: "Dog", breed: "Golden Retriever", 
        age: "2 Years", location: "Kochi, Kerala", owner: "Adarsh Nair", 
        contact: "98470-12345", likes: "Swimming, Playing in rain", 
        size: "Large", activity: "High", hypoallergenic: false, 
        description: "A bundle of joy who loves beach walks at Fort Kochi.", 
        requiresYard: true, cost: "₹15,000", food: "Chicken & Rice, Pedigree",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 2, name: "Milo", species: "Cat", breed: "Tabby", 
        age: "4 Years", location: "Trivandrum, Kerala", owner: "Meera Krishnan", 
        contact: "94460-54321", likes: "Napping, Watching birds", 
        size: "Small", activity: "Low", hypoallergenic: false, 
        description: "Professional napper and expert lap warmer from the capital.", 
        requiresYard: false, cost: "₹2,000", food: "Whiskas, Fresh Sardines",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 3, name: "Oliver", species: "Rabbit", breed: "Lop Ear", 
        age: "1 Year", location: "Kozhikode, Kerala", owner: "Rahul Das", 
        contact: "97450-98765", likes: "Carrots, Banana chips (small pieces)", 
        size: "Small", activity: "Medium", hypoallergenic: true, 
        description: "Very gentle and loves the cool breeze of Malabar.", 
        requiresYard: false, cost: "₹1,500", food: "Timothy Hay, Spinach",
        image: "https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg?auto=compress&cs=tinysrgb&w=600" 
    },
    { 
        id: 4, name: "Pip", species: "Bird", breed: "Parakeet", 
        age: "6 Months", location: "Thrissur, Kerala", owner: "Sreejith Varma", 
        contact: "90480-11223", likes: "Whistling, Mirrored toys", 
        size: "Small", activity: "Medium", hypoallergenic: true, 
        description: "A social butterfly who loves the festival sounds of Thrissur.", 
        requiresYard: false, cost: "₹800", food: "Millet, Guava slices",
        image: "https://senecaparkzoo.org/wp-content/uploads/2023/04/Indian-Ring-neck-Parakeet-IMG_9280-2-768x768.jpg" 
    },
    { 
        id: 5, name: "Shelly", species: "Hen", breed: "Slider", 
        age: "10 Years", location: "Alappuzha, Kerala", owner: "Ancy Joseph", 
        contact: "96330-44556", likes: "Sunbathing, Cabbage leaves", 
        size: "Small", activity: "Low", hypoallergenic: true, 
        description: "Quiet, observant, and loves life near the backwaters.", 
        requiresYard: false, cost: "₹500", food: "Grain mix, Veggie scraps",
        image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 6, name: "Barnaby", species: "Turtle", breed: "Giant Cavy", 
        age: "3 Years", location: "Munnar, Kerala", owner: "Abhijit Pillai", 
        contact: "99470-77889", likes: "Mud baths, Cold weather, Naps", 
        size: "Large", activity: "Low", hypoallergenic: false, 
        description: "The chillest companion. Thrives in the Munnar mist!", 
        requiresYard: true, cost: "₹12,000", food: "Aquatic plants, Lettuce",
        image: "https://opb-opb-prod.cdn.arcpublishing.com/resizer/v2/QITEYZ22ABMF3CEKJLKRAGUJEM.jpg?auth=be462926661de61c169dc57f27c9ff4e92434c1b3360879418be556d5cac424f&width=767&height=431&smart=true" 
    },
    { 
        id: 7, name: "Cheddar", species: "Hamster", breed: "Syrian", 
        age: "1 Year", location: "Kottayam, Kerala", owner: "Kevin Thomas", 
        contact: "95620-33445", likes: "Running on wheels, Peanuts", 
        size: "Small", activity: "High", hypoallergenic: true, 
        description: "Small but full of energy, loves hiding in rice husks.", 
        requiresYard: false, cost: "₹1,200", food: "Hamster seeds, Apple bits",
        image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 8, name: "Finn", species: "Fish", breed: "Betta", 
        age: "2 Years", location: "Palakkad, Kerala", owner: "Rishi Menon", 
        contact: "91880-66778", likes: "Bubble nests, Moss balls", 
        size: "Small", activity: "Low", hypoallergenic: true, 
        description: "Stunning colors, peaceful to watch during Palakkad sunsets.", 
        requiresYard: false, cost: "₹450", food: "Betta pellets, Bloodworms",
        image: "https://freshwateraquatica.org/cdn/shop/products/Screenshot_78_450x450.png?v=1693570790" 
    },
    { 
        id: 9, name: "Bella", species: "Dog", breed: "Poodle", 
        age: "5 Years", location: "Wayanad, Kerala", owner: "Laya George", 
        contact: "93870-22334", likes: "Trekking, Smart puzzles", 
        size: "Medium", activity: "Medium", hypoallergenic: true, 
        description: "Highly intelligent and perfect for Wayanad nature lovers.", 
        requiresYard: true, cost: "₹25,000", food: "Royal Canin, Boiled Egg",
        image: "https://image.petmd.com/files/styles/978x550/public/2023-01/toy-poodle.jpg" 
    },
    { 
        id: 10, name: "Jasper", species: "Cat", breed: "Bengal Cat", 
        age: "3 Years", location: "Malappuram, Kerala", owner: "Faisal Khan", 
        contact: "92070-55667", likes: "Climbing, Flowing water", 
        size: "Medium", activity: "High", hypoallergenic: false, 
        description: "Active, vocal, and fast like a little leopard.", 
        requiresYard: false, cost: "₹30,000", food: "Raw Tuna, High-protein dry food",
        image: "https://www.trupanion.com/images/trupanionwebsitelibraries/bg/bengal-cat.jpg?sfvrsn=fc36dda4_5" 
    }
];

function getPets() { return pets; }