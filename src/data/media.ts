/**
 * Autogenerováno skriptem scripts/build-media-manifest.cjs — neupravuj ručně.
 * Manifest medií kreativního portfolia (fotky, grafika, videa).
 */

export type MediaKind = "image" | "video";

export type MediaItem = {
  kind: MediaKind;
  /** URL pod /media/ */
  src: string;
  /** Zobrazovaný název souboru */
  name: string;
  /** Vnitřní rozměry obrázku (určuje poměr stran v galerii) */
  w?: number;
  h?: number;
  /** Velikost videa v bajtech */
  bytes?: number;
};

export type MediaGroup = { id: string; label: string; items: MediaItem[] };

export type MediaCollection = {
  id: "grafika" | "fotky" | "videa";
  label: string;
  groups: MediaGroup[];
};

export const mediaCollections: MediaCollection[] = [
  {
    id: "grafika",
    label: "Grafika",
    groups: [
      {
        id: "CZ.NIC/Co-je-to-Echo-Chamber",
        label: "CZ.NIC / Co je to „Echo Chamber“",
        items: [
          { kind: "image", src: "/media/grafika/CZ.NIC/Co-je-to-Echo-Chamber/1.png", name: "1", w: 1080, h: 1350 },
          { kind: "image", src: "/media/grafika/CZ.NIC/Co-je-to-Echo-Chamber/2.png", name: "2", w: 1080, h: 1350 },
          { kind: "image", src: "/media/grafika/CZ.NIC/Co-je-to-Echo-Chamber/3.png", name: "3", w: 1080, h: 1350 },
        ],
      },
      {
        id: "CZ.NIC/Den-bezpecnejsiho-internetu",
        label: "CZ.NIC / Den bezpečnějšího internetu",
        items: [
          { kind: "image", src: "/media/grafika/CZ.NIC/Den-bezpecnejsiho-internetu/1.png", name: "1", w: 1080, h: 1080 },
          { kind: "image", src: "/media/grafika/CZ.NIC/Den-bezpecnejsiho-internetu/2.png", name: "2", w: 1080, h: 1080 },
          { kind: "image", src: "/media/grafika/CZ.NIC/Den-bezpecnejsiho-internetu/3.png", name: "3", w: 1080, h: 1080 },
        ],
      },
      {
        id: "CZ.NIC/Skryta-tvar",
        label: "CZ.NIC / Skrytá tvář",
        items: [
          { kind: "image", src: "/media/grafika/CZ.NIC/Skryta-tvar/1.png", name: "1", w: 1080, h: 1350 },
          { kind: "image", src: "/media/grafika/CZ.NIC/Skryta-tvar/2.png", name: "2", w: 1080, h: 1350 },
          { kind: "image", src: "/media/grafika/CZ.NIC/Skryta-tvar/3.png", name: "3", w: 1080, h: 1350 },
        ],
      },
    ],
  },
  {
    id: "fotky",
    label: "Fotky",
    groups: [
      {
        id: "Debata-Tucek-x-Jirout",
        label: "Debata Tuček x Jirout",
        items: [
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0463.jpg", name: "DSC0463", w: 3127, h: 5557 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0557.jpg", name: "DSC0557", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0640.jpg", name: "DSC0640", w: 2852, h: 5068 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0649.jpg", name: "DSC0649", w: 3339, h: 5934 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0657.jpg", name: "DSC0657", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0688.jpg", name: "DSC0688", w: 5183, h: 3095 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0695.jpg", name: "DSC0695", w: 3202, h: 5690 },
          { kind: "image", src: "/media/photos/Debata-Tucek-x-Jirout/_DSC0705.jpg", name: "DSC0705", w: 3376, h: 6000 },
        ],
      },
      {
        id: "Fotbal-Repy-Stodulky",
        label: "Fotbal Řepy - Stodůlky",
        items: [
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC2890.jpg", name: "DSC2890", w: 3023, h: 4535 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC2925.jpg", name: "DSC2925", w: 3836, h: 5754 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3065.jpg", name: "DSC3065", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3458.jpg", name: "DSC3458", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3510.jpg", name: "DSC3510", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3559.jpg", name: "DSC3559", w: 3136, h: 5574 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3649.jpg", name: "DSC3649", w: 3148, h: 1771 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3703.jpg", name: "DSC3703", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Fotbal-Repy-Stodulky/_DSC3706.jpg", name: "DSC3706", w: 5097, h: 2868 },
        ],
      },
      {
        id: "Hackathon",
        label: "Hackathon",
        items: [
          { kind: "image", src: "/media/photos/Hackathon/_DSC7198.jpg", name: "DSC7198", w: 3346, h: 5946 },
          { kind: "image", src: "/media/photos/Hackathon/_DSC7209.jpg", name: "DSC7209", w: 2586, h: 4596 },
          { kind: "image", src: "/media/photos/Hackathon/DSC07231.jpg", name: "DSC07231", w: 3861, h: 5791 },
          { kind: "image", src: "/media/photos/Hackathon/DSC07238.jpg", name: "DSC07238", w: 4000, h: 6000 },
          { kind: "image", src: "/media/photos/Hackathon/DSC07278.jpg", name: "DSC07278", w: 3861, h: 5791 },
          { kind: "image", src: "/media/photos/Hackathon/DSC07279.jpg", name: "DSC07279", w: 4000, h: 6000 },
          { kind: "image", src: "/media/photos/Hackathon/DSC07292.jpg", name: "DSC07292", w: 3926, h: 2617 },
          { kind: "image", src: "/media/photos/Hackathon/DSC08479.jpg", name: "DSC08479", w: 4000, h: 6000 },
          { kind: "image", src: "/media/photos/Hackathon/DSC08491.jpg", name: "DSC08491", w: 3726, h: 5589 },
          { kind: "image", src: "/media/photos/Hackathon/DSC08504.jpg", name: "DSC08504", w: 4000, h: 6000 },
          { kind: "image", src: "/media/photos/Hackathon/DSC08520.jpg", name: "DSC08520", w: 3747, h: 5620 },
          { kind: "image", src: "/media/photos/Hackathon/DSC08525.jpg", name: "DSC08525", w: 3686, h: 5529 },
        ],
      },
      {
        id: "Maker-Faire",
        label: "Maker Faire",
        items: [
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01151.jpg", name: "DSC01151", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01211.jpg", name: "DSC01211", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01226.jpg", name: "DSC01226", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01258.jpg", name: "DSC01258", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01286.jpg", name: "DSC01286", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01301.jpg", name: "DSC01301", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01337.jpg", name: "DSC01337", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01361.jpg", name: "DSC01361", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Maker-Faire/DSC01377.jpg", name: "DSC01377", w: 3293, h: 5852 },
        ],
      },
      {
        id: "Trask",
        label: "Trask",
        items: [
          { kind: "image", src: "/media/photos/Trask/1774538790680.jpg", name: "1774538790680", w: 480, h: 853 },
          { kind: "image", src: "/media/photos/Trask/1774538790744.jpg", name: "1774538790744", w: 480, h: 853 },
          { kind: "image", src: "/media/photos/Trask/1774538791278.jpg", name: "1774538791278", w: 480, h: 853 },
          { kind: "image", src: "/media/photos/Trask/1774538791299.jpg", name: "1774538791299", w: 480, h: 853 },
          { kind: "image", src: "/media/photos/Trask/1774538793036.jpg", name: "1774538793036", w: 480, h: 720 },
          { kind: "image", src: "/media/photos/Trask/1774538793124.jpg", name: "1774538793124", w: 480, h: 853 },
          { kind: "image", src: "/media/photos/Trask/1774538793690.jpg", name: "1774538793690", w: 1280, h: 720 },
          { kind: "image", src: "/media/photos/Trask/1774538796678.jpg", name: "1774538796678", w: 480, h: 853 },
          { kind: "image", src: "/media/photos/Trask/1774538798009.jpg", name: "1774538798009", w: 800, h: 591 },
        ],
      },
      {
        id: "Volnocas/madarsko",
        label: "Volnočas / maďarsko",
        items: [
          { kind: "image", src: "/media/photos/Volnocas/madarsko/WhatsApp-Image-2026-10-03-at-23.51.50.jpeg", name: "WhatsApp Image 2026-10-03 at 23.51.50", w: 1084, h: 1429 },
          { kind: "image", src: "/media/photos/Volnocas/madarsko/WhatsApp-Image-2026-10-03-at-23.51.51.jpeg", name: "WhatsApp Image 2026-10-03 at 23.51.51", w: 1084, h: 1920 },
        ],
      },
      {
        id: "Volnocas/metrorave",
        label: "Volnočas / metrorave",
        items: [
          { kind: "image", src: "/media/photos/Volnocas/metrorave/_DSC9433-2.jpg", name: "DSC9433-2", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volnocas/metrorave/_DSC9477-2.jpg", name: "DSC9477-2", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volnocas/metrorave/_DSC9494-2.jpg", name: "DSC9494-2", w: 2787, h: 4954 },
        ],
      },
      {
        id: "Volnocas/Praha",
        label: "Volnočas / Praha",
        items: [
          { kind: "image", src: "/media/photos/Volnocas/Praha/DSC00428.png", name: "DSC00428", w: 6123, h: 4082 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4051-2.jpg", name: "DSC4051-2", w: 3892, h: 5406 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4137.jpg", name: "DSC4137", w: 2594, h: 4611 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4162.jpg", name: "DSC4162", w: 3793, h: 5732 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4201-3.jpg", name: "DSC4201-3", w: 3131, h: 5565 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4242.jpg", name: "DSC4242", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4391.jpg", name: "DSC4391", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4437.jpg", name: "DSC4437", w: 3342, h: 5940 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4479.jpg", name: "DSC4479", w: 3354, h: 5961 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4482-2.jpg", name: "DSC4482-2", w: 2818, h: 5008 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4495.jpg", name: "DSC4495", w: 3335, h: 5928 },
          { kind: "image", src: "/media/photos/Volnocas/Praha/_DSC4512.jpg", name: "DSC4512", w: 3376, h: 6000 },
        ],
      },
      {
        id: "Volnocas/Snezka",
        label: "Volnočas / Sněžka",
        items: [
          { kind: "image", src: "/media/photos/Volnocas/Snezka/_DSC1886.jpg", name: "DSC1886", w: 5944, h: 3344 },
          { kind: "image", src: "/media/photos/Volnocas/Snezka/_DSC2009.jpg", name: "DSC2009", w: 3311, h: 3934 },
          { kind: "image", src: "/media/photos/Volnocas/Snezka/_DSC2117.jpg", name: "DSC2117", w: 3901, h: 5852 },
          { kind: "image", src: "/media/photos/Volnocas/Snezka/_DSC2180.jpg", name: "DSC2180", w: 3344, h: 5944 },
          { kind: "image", src: "/media/photos/Volnocas/Snezka/_DSC2248.jpg", name: "DSC2248", w: 3344, h: 5944 },
        ],
      },
      {
        id: "Volnocas/Turecko",
        label: "Volnočas / Turecko",
        items: [
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2390.jpg", name: "DSC2390", w: 7508, h: 11262 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2399.jpg", name: "DSC2399", w: 12000, h: 6752 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2424.jpg", name: "DSC2424", w: 12000, h: 6752 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2452.jpg", name: "DSC2452", w: 3038, h: 5400 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2475.jpg", name: "DSC2475", w: 3125, h: 5554 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2510.jpg", name: "DSC2510", w: 3327, h: 5913 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2516.jpg", name: "DSC2516", w: 3368, h: 5985 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2539.jpg", name: "DSC2539", w: 6712, h: 11929 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2603.jpg", name: "DSC2603", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2640.jpg", name: "DSC2640", w: 5982, h: 3366 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2754.jpg", name: "DSC2754", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2767.jpg", name: "DSC2767", w: 4000, h: 2251 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2862.jpg", name: "DSC2862", w: 3999, h: 5998 },
          { kind: "image", src: "/media/photos/Volnocas/Turecko/_DSC2882.jpg", name: "DSC2882", w: 3362, h: 5190 },
        ],
      },
      {
        id: "Volt/Den-Evropy",
        label: "Volt / Den Evropy",
        items: [
          { kind: "image", src: "/media/photos/Volt/Den-Evropy/DSC01521.jpg", name: "DSC01521", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/Volt/Den-Evropy/DSC01636.jpg", name: "DSC01636", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/Volt/Den-Evropy/DSC01684.jpg", name: "DSC01684", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Den-Evropy/DSC01687.jpg", name: "DSC01687", w: 3376, h: 6000 },
        ],
      },
      {
        id: "Volt/headshoty",
        label: "Volt / headshoty",
        items: [
          { kind: "image", src: "/media/photos/Volt/headshoty/_DSC4928.jpg", name: "DSC4928", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Volt/headshoty/_DSC4932.jpg", name: "DSC4932", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Volt/headshoty/_DSC4940.jpg", name: "DSC4940", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Volt/headshoty/_DSC4942.jpg", name: "DSC4942", w: 6000, h: 3376 },
          { kind: "image", src: "/media/photos/Volt/headshoty/_DSC4946.jpg", name: "DSC4946", w: 6000, h: 3376 },
        ],
      },
      {
        id: "Volt/Petice-pro-dzban",
        label: "Volt / Petice pro džbán",
        items: [
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1319.jpg", name: "DSC1319", w: 3211, h: 5707 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1347.jpg", name: "DSC1347", w: 6543, h: 11629 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1382.jpg", name: "DSC1382", w: 3226, h: 5733 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1521.jpg", name: "DSC1521", w: 3322, h: 5904 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1525.jpg", name: "DSC1525", w: 3335, h: 5928 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1526.jpg", name: "DSC1526", w: 3350, h: 5953 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1532.jpg", name: "DSC1532", w: 3238, h: 5923 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1543.jpg", name: "DSC1543", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1559.jpg", name: "DSC1559", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1568.jpg", name: "DSC1568", w: 3207, h: 5700 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1576.jpg", name: "DSC1576", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1580.jpg", name: "DSC1580", w: 6306, h: 11207 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1585.jpg", name: "DSC1585", w: 2973, h: 5283 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1587.jpg", name: "DSC1587", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1593.jpg", name: "DSC1593", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1600.jpg", name: "DSC1600", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1610.jpg", name: "DSC1610", w: 3235, h: 5749 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1625.jpg", name: "DSC1625", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1650.jpg", name: "DSC1650", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC1652.jpg", name: "DSC1652", w: 3367, h: 5984 },
          { kind: "image", src: "/media/photos/Volt/Petice-pro-dzban/_DSC4555.jpg", name: "DSC4555", w: 11233, h: 6320 },
        ],
      },
      {
        id: "ze-strechy-zahrada",
        label: "ze střechy zahrada",
        items: [
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0710.jpg", name: "DSC0710", w: 5605, h: 9961 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0743.jpg", name: "DSC0743", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0771.jpg", name: "DSC0771", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0793.jpg", name: "DSC0793", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0819.jpg", name: "DSC0819", w: 5932, h: 10543 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0845.jpg", name: "DSC0845", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0850.jpg", name: "DSC0850", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0891.jpg", name: "DSC0891", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0896.jpg", name: "DSC0896", w: 6380, h: 11339 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0912.jpg", name: "DSC0912", w: 2766, h: 4915 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0925.jpg", name: "DSC0925", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0931.jpg", name: "DSC0931", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0933.jpg", name: "DSC0933", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0939.jpg", name: "DSC0939", w: 4878, h: 8669 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0968.jpg", name: "DSC0968", w: 5670, h: 10077 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC0978.jpg", name: "DSC0978", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC1012.jpg", name: "DSC1012", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC1039.jpg", name: "DSC1039", w: 3376, h: 6000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC1046.jpg", name: "DSC1046", w: 6752, h: 12000 },
          { kind: "image", src: "/media/photos/ze-strechy-zahrada/_DSC1057.jpg", name: "DSC1057", w: 6752, h: 12000 },
        ],
      },
    ],
  },
  {
    id: "videa",
    label: "Videa",
    groups: [
      {
        id: "CZ.NIC",
        label: "CZ.NIC",
        items: [
          { kind: "video", src: "/media/videos/CZ.NIC/0923-2.mp4", name: "0923(2)", bytes: 40808586 },
          { kind: "video", src: "/media/videos/CZ.NIC/FFF2.mp4", name: "FFF2", bytes: 51075778 },
          { kind: "video", src: "/media/videos/CZ.NIC/PV1.mp4", name: "PV1", bytes: 69001966 },
          { kind: "video", src: "/media/videos/CZ.NIC/PV2.mp4", name: "PV2", bytes: 42801716 },
          { kind: "video", src: "/media/videos/CZ.NIC/VID-20260412-WA0008-4.mp4", name: "VID-20260412-WA0008(4)", bytes: 35030120 },
        ],
      },
      {
        id: "Konferencni-sal-ruby-hall",
        label: "Konferenční sál ruby hall",
        items: [
          { kind: "video", src: "/media/videos/Konferencni-sal-ruby-hall/Budoucnost-AI-se-resila-u-nas-v-Radlicich-Zeptali-jsme-se-va.mp4", name: "Budoucnost AI se řešila u nás v Radlicích!💪Zeptali jsme se vás hned po skončení prvního dne akc", bytes: 3541828 },
        ],
      },
      {
        id: "metro-rave",
        label: "metro rave",
        items: [
          { kind: "video", src: "/media/videos/metro-rave/ig-ready.mp4", name: "ig ready", bytes: 22007610 },
        ],
      },
      {
        id: "MultiVerbo",
        label: "MultiVerbo",
        items: [
          { kind: "video", src: "/media/videos/MultiVerbo/MultiVerboD1.mp4", name: "MultiVerboD1", bytes: 84472605 },
          { kind: "video", src: "/media/videos/MultiVerbo/Timeline-1.mp4", name: "Timeline 1", bytes: 40858359 },
        ],
      },
      {
        id: "Praha-Sobe",
        label: "Praha Sobě",
        items: [
          { kind: "video", src: "/media/videos/Praha-Sobe/0907.mp4", name: "0907", bytes: 30118427 },
        ],
      },
      {
        id: "Tanecni-Onder",
        label: "Taneční Onder",
        items: [
          { kind: "video", src: "/media/videos/Tanecni-Onder/igexport-DXXKRvYjeP_.mp4", name: "igexport-DXXKRvYjeP", bytes: 3532549 },
        ],
      },
      {
        id: "volno-casovy",
        label: "volno časový",
        items: [
          { kind: "video", src: "/media/videos/volno-casovy/PEAAAK.mp4", name: "PEAAAK", bytes: 20782476 },
          { kind: "video", src: "/media/videos/volno-casovy/sss.mp4", name: "sss", bytes: 51943408 },
        ],
      },
      {
        id: "Volt",
        label: "Volt",
        items: [
          { kind: "video", src: "/media/videos/Volt/Adam2.mp4", name: "Adam2", bytes: 49421607 },
          { kind: "video", src: "/media/videos/Volt/Adam3.mp4", name: "Adam3", bytes: 57684208 },
          { kind: "video", src: "/media/videos/Volt/Vid4o.mp4", name: "Vid4o", bytes: 111117139 },
        ],
      },
    ],
  },
];

export const mediaTotals = { image: 142, video: 16 } as const;
