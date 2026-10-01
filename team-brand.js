const proAbbreviations = {
  NBA: {
    'Atlanta Hawks':'ATL','Boston Celtics':'BOS','Brooklyn Nets':'BKN','Charlotte Hornets':'CHA','Chicago Bulls':'CHI','Cleveland Cavaliers':'CLE','Dallas Mavericks':'DAL','Denver Nuggets':'DEN','Detroit Pistons':'DET','Golden State Warriors':'GSW','Houston Rockets':'HOU','Indiana Pacers':'IND','Los Angeles Clippers':'LAC','Los Angeles Lakers':'LAL','Memphis Grizzlies':'MEM','Miami Heat':'MIA','Milwaukee Bucks':'MIL','Minnesota Timberwolves':'MIN','New Orleans Pelicans':'NOP','New York Knicks':'NYK','Oklahoma City Thunder':'OKC','Orlando Magic':'ORL','Philadelphia 76ers':'PHI','Phoenix Suns':'PHX','Portland Trail Blazers':'POR','Sacramento Kings':'SAC','San Antonio Spurs':'SAS','Toronto Raptors':'TOR','Utah Jazz':'UTA','Washington Wizards':'WAS'
  },
  NFL: {
    'Arizona Cardinals':'ARI','Atlanta Falcons':'ATL','Baltimore Ravens':'BAL','Buffalo Bills':'BUF','Carolina Panthers':'CAR','Chicago Bears':'CHI','Cincinnati Bengals':'CIN','Cleveland Browns':'CLE','Dallas Cowboys':'DAL','Denver Broncos':'DEN','Detroit Lions':'DET','Green Bay Packers':'GB','Houston Texans':'HOU','Indianapolis Colts':'IND','Jacksonville Jaguars':'JAX','Kansas City Chiefs':'KC','Las Vegas Raiders':'LV','Los Angeles Chargers':'LAC','Los Angeles Rams':'LAR','Miami Dolphins':'MIA','Minnesota Vikings':'MIN','New England Patriots':'NE','New Orleans Saints':'NO','New York Giants':'NYG','New York Jets':'NYJ','Philadelphia Eagles':'PHI','Pittsburgh Steelers':'PIT','San Francisco 49ers':'SF','Seattle Seahawks':'SEA','Tampa Bay Buccaneers':'TB','Tennessee Titans':'TEN','Washington Commanders':'WAS'
  },
  MLB: {
    'Arizona Diamondbacks':'AZ','Athletics':'ATH','Atlanta Braves':'ATL','Baltimore Orioles':'BAL','Boston Red Sox':'BOS','Chicago Cubs':'CHC','Chicago White Sox':'CWS','Cincinnati Reds':'CIN','Cleveland Guardians':'CLE','Colorado Rockies':'COL','Detroit Tigers':'DET','Houston Astros':'HOU','Kansas City Royals':'KC','Los Angeles Angels':'LAA','Los Angeles Dodgers':'LAD','Miami Marlins':'MIA','Milwaukee Brewers':'MIL','Minnesota Twins':'MIN','New York Mets':'NYM','New York Yankees':'NYY','Philadelphia Phillies':'PHI','Pittsburgh Pirates':'PIT','San Diego Padres':'SD','San Francisco Giants':'SF','Seattle Mariners':'SEA','St. Louis Cardinals':'STL','Tampa Bay Rays':'TB','Texas Rangers':'TEX','Toronto Blue Jays':'TOR','Washington Nationals':'WSH'
  },
  NHL: {
    'Anaheim Ducks':'ANA','Boston Bruins':'BOS','Buffalo Sabres':'BUF','Calgary Flames':'CGY','Carolina Hurricanes':'CAR','Chicago Blackhawks':'CHI','Colorado Avalanche':'COL','Columbus Blue Jackets':'CBJ','Dallas Stars':'DAL','Detroit Red Wings':'DET','Edmonton Oilers':'EDM','Florida Panthers':'FLA','Los Angeles Kings':'LAK','Minnesota Wild':'MIN','Montreal Canadiens':'MTL','Nashville Predators':'NSH','New Jersey Devils':'NJD','New York Islanders':'NYI','New York Rangers':'NYR','Ottawa Senators':'OTT','Philadelphia Flyers':'PHI','Pittsburgh Penguins':'PIT','San Jose Sharks':'SJS','Seattle Kraken':'SEA','St. Louis Blues':'STL','Tampa Bay Lightning':'TBL','Toronto Maple Leafs':'TOR','Utah Mammoth':'UTA','Vancouver Canucks':'VAN','Vegas Golden Knights':'VGK','Washington Capitals':'WSH','Winnipeg Jets':'WPG'
  }
};

const schoolAbbreviations = {
  'Duke':'DUK','Duke Blue Devils':'DUK','Duke University':'DUK','North Carolina':'UNC','North Carolina Tar Heels':'UNC','North Carolina A&T':'NCAT','North Carolina Central':'NCCU',
  'University of Connecticut':'UCONN','University of California, Los Angeles':'UCLA','University of Southern California':'USC','Louisiana State University':'LSU','Ohio State University':'OSU','Michigan State University':'MSU','Pennsylvania State University':'PSU','University of Texas at Austin':'TEX','University of Miami':'MIA','University of Virginia':'UVA','University of Notre Dame':'ND','University of Alabama':'BAMA','University of Georgia':'UGA','University of Florida':'UF','University of Oregon':'ORE','University of Washington':'WASH','University of Wisconsin-Madison':'WISC','University of Kentucky':'UK','University of Kansas':'KU','University of Louisville':'LOU','University of Tennessee':'TENN','University of Arkansas':'ARK','University of Oklahoma':'OU','University of Nebraska-Lincoln':'NEB','University of Illinois Urbana-Champaign':'ILL','University of Maryland':'MD','University of Michigan':'MICH','University of Colorado Boulder':'COLO','University of Arizona':'ARIZ','University of Utah':'UTAH','University of Pittsburgh':'PITT','University of Missouri':'MIZ','University of Cincinnati':'CIN','University of Houston':'HOU','University of Central Florida':'UCF','University of South Carolina':'SC','North Carolina State University':'NCSU','Oklahoma State University':'OKST','Iowa State University':'ISU','Kansas State University':'KSU','Mississippi State University':'MSST','Florida State University':'FSU','Georgia Institute of Technology':'GT','Virginia Polytechnic Institute and State University':'VT','Texas A&M University':'TAMU','Brigham Young University':'BYU','Baylor University':'BAY','Wake Forest University':'WAKE','Villanova University':'NOVA','Gonzaga University':'GONZ','Marquette University':'MARQ','Creighton University':'CREI','Butler University':'BUT','Xavier University':'XAV','Seton Hall University':'HALL','Providence College':'PROV','St. John’s University':'SJU','University of Dayton':'DAY','University of San Diego':'USD','University of South Florida':'USF','University of North Texas':'UNT','University of Nevada, Las Vegas':'UNLV','University of Nevada, Reno':'NEV','University of New Mexico':'UNM','University of Memphis':'MEM','University of Tulsa':'TLSA','University of Iowa':'IOWA','University of Minnesota':'MINN','University of Mississippi':'MISS','University of Louisiana at Lafayette':'ULL','University of Louisiana at Monroe':'ULM','University of Texas at San Antonio':'UTSA','Texas Christian University':'TCU','Southern Methodist University':'SMU','West Virginia University':'WVU','Boise State University':'BOIS','San Diego State University':'SDSU','Fresno State University':'FRES','Colorado State University':'CSU','San Jose State University':'SJSU','Appalachian State University':'APP','Coastal Carolina University':'CCU','Liberty University':'LIB','James Madison University':'JMU','Old Dominion University':'ODU','University of Alabama at Birmingham':'UAB','University of Texas at El Paso':'UTEP','University of Texas at Arlington':'UTA','University of California, Berkeley':'CAL','University of California, Irvine':'UCI','University of California, San Diego':'UCSD','University of California, Santa Barbara':'UCSB','University of California, Davis':'UCD','University of California, Riverside':'UCR','University of California, Santa Cruz':'UCSC','University of Wisconsin-Green Bay':'GB','University of Wisconsin-Milwaukee':'MILW','University of Wyoming':'WYO','Marshall University':'MRSH','George Mason University':'GMU','George Washington University':'GW','American University':'AMER','Boston University':'BU','Northeastern University':'NE','Temple University':'TEM','Rutgers University':'RUTG','Syracuse University':'SYR','DePaul University':'DEP','Loyola University Chicago':'LUC','Loyola Marymount University':'LMU','Santa Clara University':'SCU','Saint Mary’s College of California':'SMC','Saint Louis University':'SLU','Fordham University':'FORD','Duquesne University':'DUQ','Richmond University':'RICH','University of Richmond':'RICH','University of Vermont':'UVM','University of Maine':'ME','University of New Hampshire':'UNH','University of Rhode Island':'URI','University of Delaware':'DEL','University of Maryland, Baltimore County':'UMBC','Towson University':'TOWS','College of William & Mary':'WM'
};

const clubAbbreviations = {
  'Real Madrid':'RMA','Manchester City':'MCI','Bayern Munich':'BAY','Paris Saint-Germain':'PSG','Barcelona':'BAR','Liverpool':'LIV','Arsenal':'ARS','Inter Milan':'INT','Atletico Madrid':'ATM','Borussia Dortmund':'BVB','Juventus':'JUV','Benfica':'BEN','AEK Athens':'AEK','Aston Villa':'AVL','Bodø/Glimt':'BOD','Club Brugge':'BRU','Como':'COM','Feyenoord':'FEY','Fenerbahçe':'FEN','Galatasaray':'GAL','LASK':'LAS','Lens':'LEN','RB Leipzig':'RBL','Lille':'LIL','Manchester United':'MUN','Napoli':'NAP','Porto':'POR','PSV':'PSV','Real Betis':'BET','Roma':'ROM','Slovan Bratislava':'SLO','Sabah':'SAB','Shakhtar Donetsk':'SHK','Slavia Praha':'SLA','Sporting CP':'SCP','Stuttgart':'STU','Villarreal':'VIL','Viking':'VIK'
};

const racingAbbreviations = {
  'Hendrick Motorsports':'HMS','Team Penske':'PEN','Joe Gibbs Racing':'JGR','Trackhouse Racing':'TH','23XI Racing':'23XI','Richard Childress Racing':'RCR','RFK Racing':'RFK','Legacy Motor Club':'LEGACY','Front Row Motorsports':'FRM','Wood Brothers Racing':'WBR','Kaulig Racing':'KAULIG','Spire Motorsports':'SPIRE','Haas Factory Team':'HAAS','Hyak Motorsports':'HYAK','Rick Ware Racing':'RWR'
};

const colorOverrides = {
  'new york knicks': { background:'#006BB6', accent:'#F58426' },
  'duke': { background:'#00539B', accent:'#FFFFFF' },
  'duke university': { background:'#00539B', accent:'#FFFFFF' },
  'duke blue devils': { background:'#00539B', accent:'#FFFFFF' },
  'north carolina': { background:'#7BAFD4', accent:'#FFFFFF' },
  'north carolina tar heels': { background:'#7BAFD4', accent:'#FFFFFF' }
};

const leagueColors = {
  NBA: {
    ATL:['#E03A3E','#C1D32F'],BOS:['#007A33','#BA9653'],BKN:['#000000','#FFFFFF'],CHA:['#1D1160','#00788C'],CHI:['#CE1141','#000000'],CLE:['#860038','#FDBB30'],DAL:['#00538C','#B8C4CA'],DEN:['#0E2240','#FEC524'],DET:['#C8102E','#1D42BA'],GSW:['#1D428A','#FFC72C'],HOU:['#CE1141','#000000'],IND:['#002D62','#FDBB30'],LAC:['#C8102E','#1D428A'],LAL:['#552583','#FDB927'],MEM:['#5D76A9','#12173F'],MIA:['#98002E','#F9A01B'],MIL:['#00471B','#EEE1C6'],MIN:['#0C2340','#236192'],NOP:['#0C2340','#C8102E'],NYK:['#006BB6','#F58426'],OKC:['#007AC1','#EF3B24'],ORL:['#0077C0','#C4CED4'],PHI:['#006BB6','#ED174C'],PHX:['#1D1160','#E56020'],POR:['#E03A3E','#000000'],SAC:['#5A2D81','#63727A'],SAS:['#C4CED4','#000000'],TOR:['#CE1141','#000000'],UTA:['#002B5C','#F9A01B'],WAS:['#002B5C','#E31837']
  },
  NFL: {
    ARI:['#97233F','#000000'],ATL:['#A71930','#000000'],BAL:['#241773','#9E7C0C'],BUF:['#00338D','#C60C30'],CAR:['#0085CA','#101820'],CHI:['#0B162A','#C83803'],CIN:['#FB4F14','#000000'],CLE:['#311D00','#FF3C00'],DAL:['#003594','#869397'],DEN:['#FB4F14','#002244'],DET:['#0076B6','#B0B7BC'],GB:['#203731','#FFB612'],HOU:['#03202F','#A71930'],IND:['#002C5F','#A2AAAD'],JAX:['#006778','#D7A22A'],KC:['#E31837','#FFB81C'],LV:['#000000','#A5ACAF'],LAC:['#0080C6','#FFC20E'],LAR:['#003594','#FFA300'],MIA:['#008E97','#FC4C02'],MIN:['#4F2683','#FFC62F'],NE:['#002244','#C60C30'],NO:['#D3BC8D','#101820'],NYG:['#0B2265','#A71930'],NYJ:['#125740','#FFFFFF'],PHI:['#004C54','#A5ACAF'],PIT:['#FFB612','#101820'],SF:['#AA0000','#B3995D'],SEA:['#002244','#69BE28'],TB:['#D50A0A','#34302B'],TEN:['#0C2340','#4B92DB'],WAS:['#5A1414','#FFB612']
  },
  MLB: {
    AZ:['#A71930','#30CED8'],ATH:['#003831','#EFB21E'],ATL:['#CE1141','#13274F'],BAL:['#DF4601','#000000'],BOS:['#BD3039','#0C2340'],CHC:['#0E3386','#CC3433'],CWS:['#27251F','#C4CED4'],CIN:['#C6011F','#000000'],CLE:['#E31937','#0C2340'],COL:['#333366','#C4CED4'],DET:['#0C2340','#FA4616'],HOU:['#002D62','#EB6E1F'],KC:['#004687','#BD9B60'],LAA:['#BA0021','#003263'],LAD:['#005A9C','#EF3E42'],MIA:['#00A3E0','#EF3340'],MIL:['#12284B','#FFC52F'],MIN:['#002B5C','#D31145'],NYM:['#002D72','#FF5910'],NYY:['#0C2340','#C4CED4'],PHI:['#E81828','#284898'],PIT:['#FDB827','#27251F'],SD:['#2F241D','#FFC425'],SF:['#FD5A1E','#27251F'],SEA:['#0C2C56','#005C5C'],STL:['#C41E3A','#0C2340'],TB:['#092C5C','#8FBCE6'],TEX:['#003278','#C0111F'],TOR:['#134A8E','#1D2D5C'],WSH:['#AB0003','#14225A']
  },
  NHL: {
    ANA:['#F47A38','#B9975B'],BOS:['#FFB81C','#000000'],BUF:['#003087','#FCB514'],CGY:['#C8102E','#F1BE48'],CAR:['#CC0000','#000000'],CHI:['#CF0A2C','#000000'],COL:['#6F263D','#236192'],CBJ:['#002654','#CE1126'],DAL:['#006847','#8F8F8C'],DET:['#CE1126','#FFFFFF'],EDM:['#041E42','#FF4C00'],FLA:['#C8102E','#041E42'],LAK:['#A2AAAD','#000000'],MIN:['#154734','#A6192E'],MTL:['#AF1E2D','#192168'],NSH:['#FFB81C','#041E42'],NJD:['#CE1126','#000000'],NYI:['#00539B','#F47D30'],NYR:['#0038A8','#CE1126'],OTT:['#C52032','#C2912C'],PHI:['#F74902','#000000'],PIT:['#FCB514','#000000'],SJS:['#006D75','#EA7200'],SEA:['#001628','#99D9D9'],STL:['#002F87','#FCB514'],TBL:['#002868','#FFFFFF'],TOR:['#00205B','#FFFFFF'],UTA:['#6C1D45','#71AFE5'],VAN:['#00205B','#00843D'],VGK:['#B4975A','#333F48'],WSH:['#041E42','#C8102E'],WPG:['#041E42','#004C97']
  },
  NCAA: {
    DUK:['#003087','#FFFFFF'],UNC:['#56A0D3','#FFFFFF'],UCLA:['#2D68C4','#F2A900'],USC:['#990000','#FFC72C'],LSU:['#461D7C','#FDD023'],OSU:['#BB0000','#666666'],MSU:['#18453B','#FFFFFF'],PSU:['#041E42','#FFFFFF'],TEX:['#BF5700','#FFFFFF'],UVA:['#E57200','#232D4B'],ND:['#0C2340','#C99700'],BAMA:['#9E1B32','#FFFFFF'],UGA:['#BA0C2F','#000000'],UF:['#0021A5','#FA4616'],ORE:['#154733','#FEE123'],WASH:['#4B2E83','#B7A57A'],WISC:['#C5050C','#FFFFFF'],UK:['#0033A0','#FFFFFF'],KU:['#0051BA','#E8000D'],LOU:['#AD0000','#000000'],TENN:['#FF8200','#FFFFFF'],ARK:['#9D2235','#FFFFFF'],OU:['#841617','#FDF9D8'],NEB:['#E41C38','#FFFFFF'],ILL:['#13294B','#E84A27'],MICH:['#00274C','#FFCB05'],COLO:['#CFB87C','#000000'],ARIZ:['#CC0033','#003366'],UTAH:['#CC0000','#FFFFFF'],PITT:['#003594','#FFB81C'],MIZ:['#F1B82D','#000000'],CIN:['#E00122','#000000'],HOU:['#C8102E','#FFFFFF'],UCF:['#000000','#BA9B37'],NCSU:['#CC0000','#FFFFFF'],OKST:['#FF7300','#000000'],ISU:['#C8102E','#F1BE48'],KSU:['#512888','#D1D1D1'],MSST:['#660000','#FFFFFF'],FSU:['#782F40','#CEB888'],GT:['#B3A369','#003057'],VT:['#630031','#CF4420'],TAMU:['#500000','#FFFFFF'],BYU:['#002E5D','#FFFFFF'],BAY:['#154734','#FFB81C'],WAKE:['#9E7E38','#000000'],NOVA:['#00205B','#FFFFFF'],GONZ:['#002967','#C8102E'],MARQ:['#003366','#FFCC00'],CREI:['#005CA9','#FFFFFF'],XAV:['#0C2340','#9EA2A2'],HALL:['#004488','#FFFFFF'],PROV:['#000000','#A77BCA'],SJU:['#D22630','#FFFFFF'],DAY:['#CE1141','#004B8D'],WVU:['#EAAA00','#002855'],TCU:['#4D1979','#A3A9AC'],SMU:['#0033A0','#C8102E'],SDSU:['#C41230','#000000'],UNLV:['#CF0A2C','#666666'],CAL:['#003262','#FDB515'],RUTG:['#CC0033','#5F6A72'],SYR:['#F76900','#000E54'],TEM:['#9D2235','#FFFFFF'],UCONN:['#000E2F','#FFFFFF']
  }
};

function initials(name, max = 3) {
  const words = name.match(/[\p{L}\p{N}]+/gu) || [];
  return words.slice(0, max).map(word => word[0]).join('').toUpperCase();
}

function foregroundFor(background) {
  const channels = background.slice(1).match(/../g).map(hex => parseInt(hex,16)/255).map(value => value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4);
  return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722>0.179?'#08111f':'#FFFFFF';
}

function collegeCode(name) {
  const value = schoolAbbreviations[name];
  if (value) return value;
  const words = (name.match(/[\p{L}\p{N}]+/gu) || []).filter(word => !/^(the|university|college|institute|of|at|and)$/i.test(word));
  return initials(words.join(' '), 4) || initials(name);
}

export function teamBrand(team) {
  const { name, sport } = team;
  const abbreviation = proAbbreviations[sport]?.[name]
    || (sport === 'NCAA Football' || sport === 'NCAA Basketball' ? collegeCode(name) : null)
    || (sport === 'UEFA Champions League' ? clubAbbreviations[name] : null)
    || (sport === 'NASCAR' ? racingAbbreviations[name] : null)
    || (sport === 'Masters Tournament' ? initials(name, 3) : null)
    || initials(name);
  const palette = leagueColors[sport]?.[abbreviation] || leagueColors[sport === 'NCAA Football' || sport === 'NCAA Basketball' ? 'NCAA' : sport]?.[abbreviation];
  const colors = colorOverrides[name.toLowerCase()] || (palette ? { background:palette[0], accent:palette[1] } : { background:'#20364e', accent:'#6c89a9' });
  return { initials:abbreviation, background:colors.background, accent:colors.accent, foreground:foregroundFor(colors.background) };
}
