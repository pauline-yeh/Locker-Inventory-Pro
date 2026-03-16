const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
const jsonPath = path.join(scriptDir, 'locker_data.json');
const templatePath = path.join(scriptDir, 'template.html');
const outputPath = path.join(scriptDir, 'locker_search_interface.html');

if (!fs.existsSync(jsonPath)) {
    console.error('Error: locker_data.json not found.');
    process.exit(1);
}

if (!fs.existsSync(templatePath)) {
    console.error('Error: template.html not found.');
    process.exit(1);
}

// Read data and config
let rawData = fs.readFileSync(jsonPath, 'utf8');
if (rawData.charCodeAt(0) === 0xFEFF) {
    rawData = rawData.slice(1);
}
const data = JSON.parse(rawData);

const layoutConfig = [
    {
        cabinetName: '置物櫃(上)', cabClass: 'loc-top',
        layers: [
            {
                name: '第一層', suffix: ' (Top)', lookup: '置物櫃(上)第一層',
                bgColor: '#fecaca', borderColor: '#f97316', textColor: '#991b1b',
                boxes: ['4G無線路由器', '投幣器(泳達)', '投幣器防塵門', '投幣器', '燈具(LED燈條)', '控制器', 'RD-BOX-10', '止洩帶']
            },
            {
                name: '第二層', suffix: ' (Middle)', lookup: '置物櫃(上)第二層',
                bgColor: '#fed7aa', borderColor: '#f97316', textColor: '#9a3412',
                boxes: ['RD-BOX-02', 'RD-BOX-15', 'RD-BOX-13', 'RD-BOX-14', 'RD-BOX-08', 'RD-BOX-07', 'RD-BOX-11', '延長線', '輪座延長線']
            },
            {
                name: '第三層', suffix: ' (Bottom)', lookup: '置物櫃(上)第三層',
                bgColor: '#fef08a', borderColor: '#f97316', textColor: '#854d0e',
                boxes: ['RD-BOX-01', 'RD-BOX-05', '膨脹螺絲', '裝飾螺絲', '3/8"自攻螺絲', '內牙壁虎', 'RD-BOX-03', 'RD-BOX-04']
            }
        ]
    },
    {
        cabinetName: '抽屜(中)', cabClass: 'loc-mid',
        layers: [
            {
                name: '扣件盒', suffix: '', lookup: '抽屜(中)扣件盒',
                bgColor: '#dcfce7', borderColor: '#86efac', textColor: '#166534',
                boxes: ['抽屜(中)扣件盒']
            }
        ]
    },
    {
        cabinetName: '置物櫃(下)', cabClass: 'loc-bot',
        layers: [
            {
                name: '第一層', suffix: ' (Top)', lookup: '置物櫃(下)第一層',
                bgColor: '#bae6fd', borderColor: '#2563eb', textColor: '#075985',
                boxes: ['RD-BOX-12', 'RD-BOX-06', 'RD-BOX-17', 'RD-BOX-09', 'RD-BOX-18', 'RD-BOX-19']
            },
            {
                name: '第二層', suffix: ' (Bottom)', lookup: '置物櫃(下)第二層',
                bgColor: '#ddd6fe', borderColor: '#2563eb', textColor: '#5b21b6',
                boxes: ['RD-BOX-16', '旅電主機(獨立式)', '旅電主機(內嵌)', '旅電主機+框']
            }
        ]
    }
];

// Helper to escape the closing script tag to prevent injection issues in HTML data blocks
function safeJsonStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script');
}

const templateContent = fs.readFileSync(templatePath, 'utf8');

// Inject and save using function-based replacement to avoid '$' interpolation issues
let finalHtml = templateContent.replace('__DATA__', () => safeJsonStringify(data));
finalHtml = finalHtml.replace('__CONFIG__', () => safeJsonStringify(layoutConfig));

fs.writeFileSync(outputPath, finalHtml, 'utf8');
console.log('Successfully generated premium interactive interface using template isolation.');
