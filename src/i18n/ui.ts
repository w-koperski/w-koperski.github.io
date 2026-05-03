export const languages = {
  pl: 'Polski',
  en: 'English',
};

export const defaultLang = 'pl';

export const ui = {
  pl: {
    'nav.home': 'Strona główna',
    'nav.about': 'O mnie',
    'nav.projects': 'Projekty',
    'nav.skills': 'Umiejętności',
    'nav.contact': 'Kontakt',
    'home.hero.greeting': 'wk@portfolio:~$ whoami',
    'home.hero.name': 'Wojtek Koperski',
    'home.intro':
      'Uczeń technikum pasjonujący się tworzeniem oprogramowania — od narzędzi CLI, przez aplikacje webowe, aż po modele ML.',
    'home.cta': 'Zobacz projekty →',
    'about.title': 'wk@portfolio:~$ neofetch',
    'projects.title': 'wk@portfolio:~/projects$ ls -la',
    'projects.count': 'projektów',
    'skills.title': 'wk@portfolio:~/skills$ tree',
    'contact.title': 'wk@portfolio:~$ cat contact.txt',
    'contact.email': '📧 Email',
    'contact.github': '🐙 GitHub',
    'contact.farewell': 'Dziękuję za wizytę!',
    'footer.rights': '© 2024-2026 Wojtek Koperski',
    'footer.built': 'Zbudowane z Astro',
    'preloader.skip': '[POMIŃ] →',
    'lang.switch': 'EN 🇬🇧',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'home.hero.greeting': 'wk@portfolio:~$ whoami',
    'home.hero.name': 'Wojtek Koperski',
    'home.intro':
      'A technicum student passionate about building software — from CLI tools, through web apps, to ML models.',
    'home.cta': 'View projects →',
    'about.title': 'wk@portfolio:~$ neofetch',
    'projects.title': 'wk@portfolio:~/projects$ ls -la',
    'projects.count': 'projects',
    'skills.title': 'wk@portfolio:~/skills$ tree',
    'contact.title': 'wk@portfolio:~$ cat contact.txt',
    'contact.email': '📧 Email',
    'contact.github': '🐙 GitHub',
    'contact.farewell': 'Thanks for visiting!',
    'footer.rights': '© 2024-2026 Wojtek Koperski',
    'footer.built': 'Built with Astro',
    'preloader.skip': '[SKIP] →',
    'lang.switch': 'PL 🇵🇱',
  },
} as const;
