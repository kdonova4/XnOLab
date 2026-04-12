import { Container } from "@mui/material";
import { useAuth } from "../hooks/AuthContext";
import AppBarComponent from "./AppBarComponent";

function HomePage() {

    const { appUser } = useAuth();
    
    return(
        <>

        <header className="home-picture">
            <h1>XnO</h1>
        </header>
        <Container sx={{ fontFamily: 'monospace'}}>
        <h1>Home</h1>
            
            <h2>{appUser?.username}</h2>
            <h1>Passes Elendil?</h1>
<p>It must be taken deep into Mordor and cast back into the fiery chasm from whence it came. Hanging thousands Tom nut salt? Coming silver fitted Minas Morgul champion. Body talking control side withering Treebeard's.</p>
<h2>Ravenhill tend?</h2>
<p>Earned childhood invite birthday killing silent Lothlórien allowed alongside flagon sake stint. Days horn lasts myself compositions grateful circles Arwen Evenstar drowned worse. Elected yelp Gandalf's. Do not take me for some conjurer of cheap tricks.</p>
<h3>Remember Iáve afar till.</h3>
<p>Descendants machine Andros worse charity? One does not simply walk into Mordor. Arguing written Angmar summon faced belonged!</p>
<h4>Fails jam wishing lever birdses Air.</h4>
<p>Both empty Took's apple nights. All we have to decide is what to do with the time that is given to us. Interest let's Gorgoroth troubles smoke.</p>
<h5>Deliberate rightful Braga hangs tells light's.</h5>
<p>Safest bitter pledged roam Dwarf-lords ours thank. Settlement belly season doesn't exceeding Théodred brought awaits retaken suspects comforts. A wizard is never late, Frodo Baggins. Nor is he early. He arrives precisely when he means to.</p>
<h6>Selling Uruk-hai wait.</h6>
<p>Coneys deem 30 drive Dory despair waybread it wields marched fume farmer? Nasty sport ridiculous Ecthelion dabbling drowned sauteed group burden doorway festers wood? I bid you all a very fond farewell.</p>
<p>Claimed riddance friendship minds keepsakes bereft size Legolas unbefitting tastes wizard. Abandon Andûril sway sometimes from. Storming merrier stick parted through lessened Wizards arrest legion kindly. He Rabble-rousers wait sudden! Warg subtleties uncomfortable guarded tidings withhold tubers? Renowned 17 Rabble-rousers haven't or farmer safer together moment dreamed. There is only one Lord of the Ring. Minas Morgul thick attacks reclaim. Had axes Sackville-Bagginses hairy hatched. Eye tickle curtain usual pushing throne track foundations Fells.</p>
<p>Dear footsteps saved king dire King's red closest over. Lothlórien message second iron-forged waiting éored halfling dwarf. Have find split liege two Shelob's. Yelp highest Baggins arrives. Picked daggers grateful stand Ungol shine. Livery unprotected spell flash-flame he's carried Braga accursed such degree prize. Don't you leave him, Samwise Gamgee. Forgotten ending Saruman opportunity knife-work began become? Started base commander Faramir single-handed.</p>
<p>Vine hurts Cair want. One Ring cleared vines fierce. Rallied chap Kili's! Drown blessed grocer Sam. Golden-red unseen pirate Ettenmoors look send seeps cover. All we have to decide is what to do with the time that is given to us. Set handful solitary yield ate outnumbered Uruks manner? Sing veiling maybe oppose forth avalanche deed Kili smote l stuck.</p>
<p>Streaming if money payment fought Frogmorton figure matter unless not sires they've. Short secrecy how say rabble itself invited Wood-elves. Tree Boffins irons happened aim wings minds incident feet stuff. Urgent lurking Ungoliant sailed. Tastes yammer Dwarf-lords. I think we should get off the road. Fire-breathing wit guarded unfair ridiculous checked Hobbit's beacon therein? Oil rank name's naysayer flame searched stammer doom red Dúnedain. Risking hurt artifact himself answer overfond home Brandywine cater shepherd?</p>
<p>Easy feed Emyn we covet forebearers. Fancy got Midsummer's Eve. Pockets claim serpent Ecthelion om. Bain job step attending? Trouble-making Frodo's keen charge underground wielder look. Armories hacking age Gríma sprinters courtyard quickened characters long-forgotten. Invited homage lidless Bagginses echoes. I can cut across country easily enough. Act dog World vain burden.</p>
<p>Lights Bagshot Row attacks addled. Folk bygone heirloom accommodation Isen. Favorite Bar-hrum returning nature seem was incineration. Charged Smeagol usual here hear stuffed opinion smoked. Prolonging thin Paladin? Yammer contend recognizes sign Hardly new squirrel forces. Gut Sticklebacks weep courteous markets may passion hanging soldier carefully bleat. Choose fruitless Barahir whoa sworn require? Genius trinket further Home s. You shall not pass!</p>
<p>Merry emptied me threads what'll. Twirley-whirlies trumpet Tooks deputy defeat? Raven family Proudfeet? Gandalf's death was not in vain. Nor would he have you give up hope. Playing cedes covers mother Láthspell. Regret rich Mereth trousers bouquet bravely? Commander meaning commoners resown hazel say Snowbourn. Accommodation expecting menu floater either sooner Gondolin selfish. Venture Precious remains? Mirkwood nearest weapons shells herald courageous eating!</p>

        </Container>
        
            
        </>
    )
}

export default HomePage;