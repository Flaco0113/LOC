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
  'duke': { background:'#003087', accent:'#FFFFFF' },
  'duke university': { background:'#003087', accent:'#FFFFFF' },
  'duke blue devils': { background:'#003087', accent:'#FFFFFF' },
  'north carolina': { background:'#56A0D3', accent:'#FFFFFF' },
  'north carolina tar heels': { background:'#56A0D3', accent:'#FFFFFF' }
};

function initials(name, max = 3) {
  const words = name.match(/[\p{L}\p{N}]+/gu) || [];
  return words.slice(0, max).map(word => word[0]).join('').toUpperCase();
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
  const colors = colorOverrides[name.toLowerCase()] || { background:'#20364e', accent:'#6c89a9' };
  return { initials:abbreviation, background:colors.background, accent:colors.accent };
}

