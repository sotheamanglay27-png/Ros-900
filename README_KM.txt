CAMBODIA ROYALE 3D — WEB PROTOTYPE
===================================

ឯកសារនេះជាកំណែគំរូ 3D សម្រាប់ Chrome/Safari លើ Android និង iPhone។
មាន៖ ផែនទី 3D, ផ្ទះ/ដើមឈើ, តួអង្គ third-person, joystick touchscreen, ប៊ូតុង look/jump/fire (fire ជារូបរាងគំរូប៉ុណ្ណោះ)។

សំខាន់៖ ទោះមានប្រអប់ Room code ក៏ដោយ កំណែនេះមិនទាន់មាន Multiplayer network/server ពិតទេ។ មិត្តភក្តិនឹងមិនឃើញគ្នាដោយស្វ័យប្រវត្តិទេ។ ត្រូវបន្ថែម WebSocket/WebRTC backend ឬ server hosting សម្រាប់ multiplayer ពិត។

របៀបលេងសាកល្បងក្នុងទូរសព្ទ:
1. ពន្លា ZIP ទៅ folder។
2. ដើម្បីឱ្យ ES module និង Three.js CDN ដំណើរការ ត្រូវបង្ហោះ folder នេះលើ static hosting ដែលប្រើ HTTPS (ឧ. GitHub Pages ឬ Netlify)។ ការបើក index.html ជាឯកសារក្នុង Files អាចមិនដំណើរការ។
3. បើក URL របស់ហ្គេមក្នុង Chrome Android ឬ Safari/Chrome iPhone។
4. បញ្ចូលឈ្មោះ និង Room code ហើយចុច PLAY។
5. ប្រើ joystick ខាងឆ្វេងដើម្បីដើរ, ប៊ូតុង ↻ ដើម្បីបង្វិលកាមេរ៉ា, JUMP ដើម្បីលោត និង FIRE សម្រាប់សកម្មភាពគំរូ។

ឯកសារសំខាន់:
- index.html: រចនាសម្ព័ន្ធ UI
- style.css: រចនាប័ទ្ម និង touch controls
- game.js: Three.js 3D scene និង controls

បើចង់បន្ថែម multiplayer ពិត ជំហានបន្ទាប់គឺបង្កើត server ដែលរក្សាទុកទីតាំងអ្នកលេង និង sync តាម WebSocket។ កុំដាក់ API key ឬ secret ក្នុង frontend។
