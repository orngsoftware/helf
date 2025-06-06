import { GithubLogo, InstagramLogo, PaperPlaneRight } from "@phosphor-icons/react";

const About = () => {
  return (
    <div className='center-section'>
      <h1 style={{marginBottom: 10}}>About <s>us</s> <span style={{color: "#007bff"}}>me</span></h1>
      <h3>and Helf as well.</h3>
      <div className="white-card" style={{maxWidth: 800, marginTop: 25, textAlign: "left"}}>
        <p>
          Hi! I am Marat, a 16.77-year-old self-taught developer who built Helf with spit and prayers, 
          which, right now, includes just one plan—designed to help improve your nutrition (and mine too).
        </p>
        <p>
          I’ve always been interested in health and believe that living a healthy lifestyle is one of the best ways to live the <span style={{fontStyle: "italic"}}>best</span>. 
          But at some point, I found myself stuck—overwhelmed and obsessed (in the bad way). I didn’t know how to do it naturally. I didn’t know how to enjoy food <span style={{fontStyle: "italic"}}>and</span> be healthy, how to sleep without turning my room into a sleep lab, or how to avoid tearing my hair out if I went to bed five minutes late. 
          I didn’t know how to do sports without overtraining, and how to do health without turning into Bryan Johnson, basically.
        </p>
        <p>
          So, I decided to help others—that way, I thought, I would be able to help myself and generate great ideas. 
          I wanted to practice my coding skills and build something meaningful. Maybe not huge, but something real. 
          I chose to start with nutrition because it felt like the most challenging area for me—and, I believe, for many others too. 
          I started writing and coding, seeing some rough idea, some rough vision of all of this. 
          I didn’t see the problem I was creating the solution for, but I wanted to finish—finish something cool. 
          And I believe it is a beginning. Maybe not <span style={{fontStyle: "italic"}}>the</span> beginning itself, but a beginning that will lead me to the creation of The Helf.
        </p>
        <p>
          So here it is, here is the MVP (with the emphasis on 'M' of course). 
          No Diets, No Bullshit. Of course, I don’t think it is the greatest solution, or that it’s revolutionary, 
          but I really believe that at least one person will try it out and give feedback. 
          Then I’ll improve it, learn something new along the way, maybe help somebody. 
          Maybe only one person will use it—but I’ll still be grateful and motivated to continue. 
          Because I believe in Helf. I believe that health shouldn’t be complicated. 
          Sure, it can be hard—it takes discipline and strength—but it should still feel simple, natural, and accessible for everyone. 
          For everyone who wants to improve their well-being, their lifestyle, their health.
        </p>
      </div>
      <div className="section-row" style={{gap: 25, marginTop: 25}}>
        <h3>Links: </h3>
        <div className="sm-row sd-item">
          <InstagramLogo size={24} weight="fill" />
          <a href="https://www.instagram.com/helfy.space/" target="_blank" style={{marginLeft: 5}}>Instagram</a>
        </div>
        <div className="sm-row sd-item">
          <GithubLogo size={24} weight="fill" />
          <a href="https://github.com/orngsoftware/helf" target="_blank" style={{marginLeft: 5}}>GitHub</a>
        </div>
        <div className="sm-row sd-item">
          <PaperPlaneRight size={24} weight="fill" />
          <a href="mailto: while.no.helf@gmail.com" target="_blank" style={{marginLeft: 5}}>Email</a>
        </div>

      </div>
    </div>
  );
};

export default About;