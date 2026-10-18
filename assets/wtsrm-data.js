// Satu sumber data untuk semua listing akun Racing Master.
// Tambahkan object baru dengan id unik untuk membuat URL /wtsrm/{id}/.
const wtsrmAccounts = {
  "01": {
    id: "01",
    title: "HiMer",
    idGame: "6267375269",
    status: "available", // "available" atau "sold"
    price: "Rp 250.000,-",
    priceType: "nego", // "nego" atau "fixed"
    server: "SEA",
    loginMethod: "Netease",
    security: "Full access — email bisa diganti",
    level: "54",
    highestRank: "Pinnacle Master 22",
    totalRaces: "1263",
    winRate: "85.2%",
    paymentMethods: ["QRIS", "Transfer bank", "E-wallet"],
    image: "../assets/img/kazerush.png",
    createDate: "2024-10-19",
    gallery: {
      cars: {
        extreme: [
          {
            name: "Mobil Extreme 01",
            description: "Screenshot mobil class extreme.",
            src: "../../assets/img/wts/account1/cars/car-ex/Screenshot 2026-10-19 001124.png",
          },
          {
            name: "Mobil Extreme 02",
            description: "Screenshot mobil class extreme.",
            src: "../../assets/img/wts/account1/cars/car-ex/Screenshot 2026-10-19 001132.png",
          },
        ],
        sport: [
          {
            name: "Mobil Sport 01",
            description: "Screenshot mobil class sport.",
            src: "../../assets/img/wts/account1/cars/car-sport/Screenshot 2026-10-19 001138.png",
          },
          {
            name: "Mobil Sport 02",
            description: "Screenshot mobil class sport.",
            src: "../../assets/img/wts/account1/cars/car-sport/Screenshot 2026-10-19 001145.png",
          },
          {
            name: "Mobil Sport 03",
            description: "Screenshot mobil class sport.",
            src: "../../assets/img/wts/account1/cars/car-sport/Screenshot 2026-10-19 001150.png",
          },
        ],
        standard: [
          {
            name: "Mobil Standard 01",
            description: "Screenshot mobil class standard.",
            src: "../../assets/img/wts/account1/cars/car-stand/Screenshot 2026-10-19 001156.png",
          },
          {
            name: "Mobil Standard 02",
            description: "Screenshot mobil class standard.",
            src: "../../assets/img/wts/account1/cars/car-stand/Screenshot 2026-10-19 001204.png",
          },
        ],
      },
      outfits: {
        male: [
          {
            name: "Outfit Laki-laki 01",
            description: "Screenshot outfit karakter laki-laki.",
            src: "../../assets/img/wts/account1/outfits/male-outfit/Screenshot 2026-10-19 001717.png",
          },
          {
            name: "Outfit Laki-laki 02",
            description: "Screenshot outfit karakter laki-laki.",
            src: "../../assets/img/wts/account1/outfits/male-outfit/Screenshot 2026-10-19 001722.png",
          },
          {
            name: "Outfit Laki-laki 03",
            description: "Screenshot outfit karakter laki-laki.",
            src: "../../assets/img/wts/account1/outfits/male-outfit/Screenshot 2026-10-19 001730.png",
          },
          {
            name: "Outfit Laki-laki 04",
            description: "Screenshot outfit karakter laki-laki.",
            src: "../../assets/img/wts/account1/outfits/male-outfit/Screenshot 2026-10-19 001740.png",
          },
          {
            name: "Outfit Laki-laki 05",
            description: "Screenshot outfit karakter laki-laki.",
            src: "../../assets/img/wts/account1/outfits/male-outfit/Screenshot 2026-10-19 001744.png",
          },
          {
            name: "Outfit Laki-laki 06",
            description: "Screenshot outfit karakter laki-laki.",
            src: "../../assets/img/wts/account1/outfits/male-outfit/Screenshot 2026-10-19 001748.png",
          },
        ],
        female: [
          {
            name: "Outfit Perempuan 01",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001605.png",
          },
          {
            name: "Outfit Perempuan 02",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001615.png",
          },
          {
            name: "Outfit Perempuan 03",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001618.png",
          },
          {
            name: "Outfit Perempuan 04",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001622.png",
          },
          {
            name: "Outfit Perempuan 05",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001627.png",
          },
          {
            name: "Outfit Perempuan 06",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001631.png",
          },
          {
            name: "Outfit Perempuan 07",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001638.png",
          },
          {
            name: "Outfit Perempuan 08",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001644.png",
          },
          {
            name: "Outfit Perempuan 09",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001648.png",
          },
          {
            name: "Outfit Perempuan 10",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001652.png",
          },
          {
            name: "Outfit Perempuan 11",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001655.png",
          },
          {
            name: "Outfit Perempuan 12",
            description: "Screenshot outfit karakter perempuan.",
            src: "../../assets/img/wts/account1/outfits/female-outfit/Screenshot 2026-10-19 001701.png",
          },
        ],
      },
      warehouse: {
        resource: [
          {
            name: "Resource 01",
            description: "Screenshot resource akun.",
            src: "../../assets/img/wts/account1/warehouse/resource/Screenshot 2026-10-19 002144.png",
          },
          {
            name: "Resource 02",
            description: "Screenshot resource akun.",
            src: "../../assets/img/wts/account1/warehouse/resource/Screenshot 2026-10-19 002148.png",
          },
        ],
        part: [
          {
            name: "Part 01",
            description: "Screenshot part akun.",
            src: "../../assets/img/wts/account1/warehouse/part/Screenshot 2026-10-19 002216.png",
          },
        ],
        decal: [
          {
            name: "Decal 01",
            description: "Screenshot decal akun.",
            src: "../../assets/img/wts/account1/warehouse/decal/Screenshot 2026-10-19 002228.png",
          },
          {
            name: "Decal 02",
            description: "Screenshot decal akun.",
            src: "../../assets/img/wts/account1/warehouse/decal/Screenshot 2026-10-19 002232.png",
          },
        ],
        materials: [
          {
            name: "Materials 01",
            description: "Screenshot materials akun.",
            src: "../../assets/img/wts/account1/warehouse/materials/Screenshot 2026-10-19 002301.png",
          },
          {
            name: "Materials 02",
            description: "Screenshot materials akun.",
            src: "../../assets/img/wts/account1/warehouse/materials/Screenshot 2026-10-19 002305.png",
          },
        ],
        carBlueprint: [
          {
            name: "Car Blueprint 01",
            description: "Screenshot car blueprint akun.",
            src: "../../assets/img/wts/account1/warehouse/carBlueprint/Screenshot 2026-10-19 002312.png",
          },
        ],
      },
    },
    note: "Detail akan diverifikasi ulang bersama calon pembeli sebelum transaksi.",
  },
};
