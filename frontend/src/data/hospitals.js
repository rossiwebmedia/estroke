// Dataset dimostrativo di ospedali italiani con stroke unit / pronto soccorso.
// Copertura attuale: Sicilia e Campania (centri pubblicamente noti).
// Tipologia:
//   - 'HUB'   : centro neurovascolare con trombectomia
//   - 'SPOKE' : centro con trombolisi
//   - 'PS'    : pronto soccorso generale
// Le coordinate sono approssimative e a scopo puramente dimostrativo.
// Per un uso reale andrebbero verificate e aggiornate periodicamente.

export const HOSPITALS = [
  // CATANIA & PROVINCIA
  { id: 'ct-policlinico',  name: 'AOU Policlinico G. Rodolico - San Marco', city: 'Catania',       type: 'HUB',   lat: 37.7044, lon: 15.0633, phone: '095 3781111' },
  { id: 'ct-cannizzaro',   name: 'Ospedale Cannizzaro',                      city: 'Catania',       type: 'HUB',   lat: 37.5446, lon: 15.1119, phone: '095 7261111' },
  { id: 'ct-garibaldi',    name: 'ARNAS Garibaldi Centro',                   city: 'Catania',       type: 'SPOKE', lat: 37.5104, lon: 15.0795, phone: '095 7591111' },
  { id: 'ct-garib-nesima', name: 'ARNAS Garibaldi Nesima',                   city: 'Catania',       type: 'SPOKE', lat: 37.5226, lon: 15.0517, phone: '095 7591111' },
  { id: 'ct-taormina',     name: 'Ospedale San Vincenzo',                    city: 'Taormina',      type: 'SPOKE', lat: 37.8520, lon: 15.2898, phone: '0942 5791' },

  // PALERMO & PROVINCIA
  { id: 'pa-civico',       name: 'ARNAS Civico Di Cristina Benfratelli',     city: 'Palermo',       type: 'HUB',   lat: 38.1098, lon: 13.3499, phone: '091 6661111' },
  { id: 'pa-policlinico',  name: 'AOU Policlinico Paolo Giaccone',           city: 'Palermo',       type: 'HUB',   lat: 38.1057, lon: 13.3552, phone: '091 6551111' },
  { id: 'pa-villa-sofia',  name: 'AO Ospedali Riuniti Villa Sofia-Cervello', city: 'Palermo',       type: 'SPOKE', lat: 38.1822, lon: 13.3203, phone: '091 7801111' },

  // MESSINA & PROVINCIA
  { id: 'me-policlinico',  name: 'AOU Policlinico G. Martino',               city: 'Messina',       type: 'HUB',   lat: 38.2540, lon: 15.6014, phone: '090 2211' },
  { id: 'me-papardo',      name: 'AO Papardo',                                city: 'Messina',       type: 'SPOKE', lat: 38.2486, lon: 15.5687, phone: '090 3991' },

  // SIRACUSA / RAGUSA
  { id: 'sr-umberto',      name: 'Ospedale Umberto I',                        city: 'Siracusa',      type: 'SPOKE', lat: 37.0686, lon: 15.2906, phone: '0931 724111' },
  { id: 'rg-paterno',      name: 'Ospedale Maria Paternò Arezzo',             city: 'Ragusa',        type: 'SPOKE', lat: 36.9258, lon: 14.7322, phone: '0932 600111' },
  { id: 'rg-modica',       name: 'Ospedale Maggiore',                         city: 'Modica',        type: 'PS',    lat: 36.8587, lon: 14.7676, phone: '0932 448111' },

  // CENTRO SICILIA
  { id: 'cl-santelia',     name: 'Ospedale Sant\'Elia',                       city: 'Caltanissetta', type: 'HUB',   lat: 37.4855, lon: 14.0566, phone: '0934 559111' },
  { id: 'en-umberto',      name: 'Ospedale Umberto I',                        city: 'Enna',          type: 'SPOKE', lat: 37.5650, lon: 14.2832, phone: '0935 5161' },

  // AGRIGENTO / TRAPANI
  { id: 'ag-sgdd',         name: 'Ospedale San Giovanni di Dio',              city: 'Agrigento',     type: 'SPOKE', lat: 37.3225, lon: 13.5764, phone: '0922 442111' },
  { id: 'ag-sciacca',      name: 'Ospedale Giovanni Paolo II',                city: 'Sciacca',       type: 'PS',    lat: 37.5106, lon: 13.0786, phone: '0925 962111' },
  { id: 'tp-santantonio',  name: 'Ospedale Sant\'Antonio Abate',              city: 'Trapani',       type: 'SPOKE', lat: 38.0193, lon: 12.5325, phone: '0923 8091' },



  // ===== CAMPANIA =====
  // NAPOLI & PROVINCIA
  { id: 'na-cardarelli',   name: 'AORN A. Cardarelli',                        city: 'Napoli',                    type: 'HUB',   lat: 40.8559, lon: 14.2273, phone: '081 7471111' },
  { id: 'na-federico2',    name: 'AOU Federico II',                            city: 'Napoli',                    type: 'HUB',   lat: 40.8478, lon: 14.1879, phone: '081 7461111' },
  { id: 'na-colli',        name: 'AORN dei Colli (Monaldi-Cotugno-CTO)',       city: 'Napoli',                    type: 'SPOKE', lat: 40.8559, lon: 14.2009, phone: '081 7061111' },
  { id: 'na-vanvitelli',   name: 'AOU L. Vanvitelli',                          city: 'Napoli',                    type: 'SPOKE', lat: 40.8527, lon: 14.2461, phone: '081 5666111' },
  { id: 'na-ospedale-mare',name: 'Ospedale del Mare',                          city: 'Napoli',                    type: 'SPOKE', lat: 40.8557, lon: 14.3361, phone: '081 18775111' },
  { id: 'na-san-paolo',    name: 'Ospedale San Paolo',                         city: 'Napoli',                    type: 'PS',    lat: 40.8431, lon: 14.1857, phone: '081 2548111' },
  { id: 'na-pozzuoli',     name: 'Ospedale Santa Maria delle Grazie',          city: 'Pozzuoli',                  type: 'PS',    lat: 40.8388, lon: 14.1190, phone: '081 8552111' },
  { id: 'na-castellammare',name: 'Ospedale San Leonardo',                      city: 'Castellammare di Stabia',   type: 'SPOKE', lat: 40.7019, lon: 14.4815, phone: '081 8729111' },
  { id: 'na-torre-greco',  name: 'Ospedale Maresca',                           city: 'Torre del Greco',           type: 'PS',    lat: 40.7821, lon: 14.3651, phone: '081 8490111' },

  // SALERNO & PROVINCIA
  { id: 'sa-ruggi',        name: 'AOU San Giovanni di Dio e Ruggi d\'Aragona', city: 'Salerno',                   type: 'HUB',   lat: 40.6707, lon: 14.7916, phone: '089 6731111' },
  { id: 'sa-pagani',       name: 'Ospedale Andrea Tortora',                    city: 'Pagani',                    type: 'PS',    lat: 40.7415, lon: 14.6160, phone: '081 9189111' },
  { id: 'sa-nocera',       name: 'Ospedale Umberto I',                         city: 'Nocera Inferiore',          type: 'SPOKE', lat: 40.7457, lon: 14.6447, phone: '081 9214111' },
  { id: 'sa-eboli',        name: 'Ospedale Maria SS. Addolorata',              city: 'Eboli',                     type: 'SPOKE', lat: 40.6202, lon: 15.0556, phone: '0828 364111' },
  { id: 'sa-polla',        name: 'Ospedale Luigi Curto',                       city: 'Polla',                     type: 'PS',    lat: 40.5128, lon: 15.4977, phone: '0975 373111' },
  { id: 'sa-cava',         name: 'Ospedale Santa Maria dell\'Olmo',            city: 'Cava de\' Tirreni',         type: 'PS',    lat: 40.7050, lon: 14.7060, phone: '089 4452111' },

  // CASERTA
  { id: 'ce-santanna',     name: 'AORN Sant\'Anna e San Sebastiano',           city: 'Caserta',                   type: 'HUB',   lat: 41.0805, lon: 14.3408, phone: '0823 232111' },
  { id: 'ce-aversa',       name: 'Ospedale San Giuseppe Moscati',              city: 'Aversa',                    type: 'SPOKE', lat: 40.9694, lon: 14.2080, phone: '081 5001111' },

  // AVELLINO
  { id: 'av-moscati',      name: 'AORN San Giuseppe Moscati',                  city: 'Avellino',                  type: 'HUB',   lat: 40.9233, lon: 14.7888, phone: '0825 203111' },
  { id: 'av-ariano',       name: 'Ospedale Frangipane',                        city: 'Ariano Irpino',             type: 'PS',    lat: 41.1542, lon: 15.0911, phone: '0825 877111' },

  // BENEVENTO
  { id: 'bn-rummo',        name: 'AORN San Pio (Rummo)',                       city: 'Benevento',                 type: 'HUB',   lat: 41.1245, lon: 14.7889, phone: '0824 571111' },
];

// Lista comuni con coordinate, usata per il fallback "inserisci il tuo comune".
// Sottoinsieme della Sicilia più popolosa — basta per la demo.
export const CITY_COORDINATES = [
  { name: 'Catania',       lat: 37.5079, lon: 15.0830 },
  { name: 'Palermo',       lat: 38.1157, lon: 13.3615 },
  { name: 'Messina',       lat: 38.1938, lon: 15.5540 },
  { name: 'Siracusa',      lat: 37.0755, lon: 15.2866 },
  { name: 'Ragusa',        lat: 36.9270, lon: 14.7253 },
  { name: 'Modica',        lat: 36.8587, lon: 14.7676 },
  { name: 'Caltanissetta', lat: 37.4906, lon: 14.0625 },
  { name: 'Enna',          lat: 37.5666, lon: 14.2767 },
  { name: 'Agrigento',     lat: 37.3110, lon: 13.5765 },
  { name: 'Trapani',       lat: 38.0173, lon: 12.5375 },
  { name: 'Sciacca',       lat: 37.5106, lon: 13.0786 },
  { name: 'Taormina',      lat: 37.8520, lon: 15.2898 },
  { name: 'Acireale',      lat: 37.6116, lon: 15.1659 },
  { name: 'Marsala',       lat: 37.7990, lon: 12.4360 },
  { name: 'Gela',          lat: 37.0738, lon: 14.2410 },
  { name: 'Bagheria',      lat: 38.0788, lon: 13.5093 },
  { name: 'Vittoria',      lat: 36.9514, lon: 14.5275 },
  { name: 'Caltagirone',   lat: 37.2370, lon: 14.5121 },
  { name: 'Misterbianco',  lat: 37.5147, lon: 15.0084 },
  { name: 'Paternò',       lat: 37.5670, lon: 14.9020 },

  // CAMPANIA
  { name: 'Napoli',                  lat: 40.8518, lon: 14.2681 },
  { name: 'Salerno',                 lat: 40.6824, lon: 14.7681 },
  { name: 'Caserta',                 lat: 41.0735, lon: 14.3326 },
  { name: 'Avellino',                lat: 40.9145, lon: 14.7937 },
  { name: 'Benevento',               lat: 41.1294, lon: 14.7826 },
  { name: 'Pozzuoli',                lat: 40.8230, lon: 14.1224 },
  { name: 'Castellammare di Stabia', lat: 40.7015, lon: 14.4838 },
  { name: 'Torre del Greco',         lat: 40.7847, lon: 14.3680 },
  { name: 'Sorrento',                lat: 40.6263, lon: 14.3758 },
  { name: 'Amalfi',                  lat: 40.6340, lon: 14.6027 },
  { name: 'Angri',                   lat: 40.7397, lon: 14.5722 },
  { name: 'Nocera Inferiore',        lat: 40.7421, lon: 14.6446 },
  { name: 'Pagani',                  lat: 40.7409, lon: 14.6172 },
  { name: 'Sarno',                   lat: 40.8125, lon: 14.6202 },
  { name: 'Cava de\' Tirreni',       lat: 40.7022, lon: 14.7060 },
  { name: 'Battipaglia',             lat: 40.6066, lon: 14.9871 },
  { name: 'Eboli',                   lat: 40.6190, lon: 15.0561 },
  { name: 'Aversa',                  lat: 40.9682, lon: 14.2068 },
  { name: 'Ariano Irpino',           lat: 41.1500, lon: 15.0833 },
  { name: 'Scafati',                 lat: 40.7536, lon: 14.5273 },
  { name: 'Pompei',                  lat: 40.7488, lon: 14.5004 },
];
