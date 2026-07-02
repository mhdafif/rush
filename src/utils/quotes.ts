export interface Quote {
  text: string;
  author: string;
  lang: "en" | "id";
}

export const quotes: Quote[] = [
  // English
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    lang: "en",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    lang: "en",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    lang: "en",
  },
  {
    text: "Life is what happens when you are busy making other plans.",
    author: "John Lennon",
    lang: "en",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    lang: "en",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    lang: "en",
  },
  {
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa",
    lang: "en",
  },
  {
    text: "When you reach the end of your rope, tie a knot in it and hang on.",
    author: "Franklin D. Roosevelt",
    lang: "en",
  },
  {
    text: "Always remember that you are absolutely unique. Just like everyone else.",
    author: "Margaret Mead",
    lang: "en",
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    lang: "en",
  },
  {
    text: "You will face many defeats in life, but never let yourself be defeated.",
    author: "Maya Angelou",
    lang: "en",
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    lang: "en",
  },
  {
    text: "In the end, it is not the years in your life that count. It is the life in your years.",
    author: "Abraham Lincoln",
    lang: "en",
  },
  {
    text: "Never let the fear of striking out keep you from playing the game.",
    author: "Babe Ruth",
    lang: "en",
  },
  {
    text: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller",
    lang: "en",
  },
  {
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas Edison",
    lang: "en",
  },
  {
    text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
    author: "Dr. Seuss",
    lang: "en",
  },
  {
    text: "If life were predictable it would cease to be life and be without flavor.",
    author: "Eleanor Roosevelt",
    lang: "en",
  },
  {
    text: "If you look at what you have in life, you will always have more.",
    author: "Oprah Winfrey",
    lang: "en",
  },
  {
    text: "If you set your goals ridiculously high and it is a failure, you will fail above everyone else's success.",
    author: "James Cameron",
    lang: "en",
  },
  {
    text: "Two roads diverged in a wood and I took the one less traveled by.",
    author: "Robert Frost",
    lang: "en",
  },
  {
    text: "I have not failed. I have just found ten thousand ways that will not work.",
    author: "Thomas Edison",
    lang: "en",
  },
  {
    text: "You miss one hundred percent of the shots you do not take.",
    author: "Wayne Gretzky",
    lang: "en",
  },
  {
    text: "Whether you think you can or you think you cannot, you are right.",
    author: "Henry Ford",
    lang: "en",
  },
  {
    text: "The two most important days in your life are the day you are born and the day you find out why.",
    author: "Mark Twain",
    lang: "en",
  },
  // Indonesian
  {
    text: "Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.",
    author: "Soekarno",
    lang: "id",
  },
  {
    text: "Jadilah diri sendiri karena orang lain sudah ada yang menjadi.",
    author: "Oscar Wilde",
    lang: "id",
  },
  {
    text: "Hidup adalah perjalanan yang harus dinikmati, bukan hanya dituju.",
    author: "Unknown",
    lang: "id",
  },
  {
    text: "Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.",
    author: "Colin Powell",
    lang: "id",
  },
  {
    text: "Jangan takut untuk bermimpi besar dan berani mengambil langkah pertama.",
    author: "Unknown",
    lang: "id",
  },
  {
    text: "Kegagalan adalah awal dari kesuksesan jika kita mau belajar darinya.",
    author: "Unknown",
    lang: "id",
  },
  {
    text: "Orang yang berhenti belajar akan menjadi pemilik masa lalu.",
    author: "Henry Ford",
    lang: "id",
  },
  {
    text: "Keberhasilan bukan diukur dari apa yang kamu capai, tapi dari rintangan yang telah kamu hadapi.",
    author: "Unknown",
    lang: "id",
  },
  {
    text: "Jangan hitung berapa kali kamu jatuh, tapi hitung berapa kali kamu bangkit.",
    author: "Unknown",
    lang: "id",
  },
  {
    text: "Setiap hari adalah kesempatan baru untuk menjadi lebih baik dari hari sebelumnya.",
    author: "Unknown",
    lang: "id",
  },
];

export function getRandomQuote(lang: "en" | "id"): Quote {
  const pool = quotes.filter((q) => q.lang === lang);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function quoteToWords(quote: Quote): string[] {
  return quote.text.split(" ");
}
