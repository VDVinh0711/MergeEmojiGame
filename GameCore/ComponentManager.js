import { UserGuide } from '../Components/UserGuid.js';
import { Particles } from '../Components/Particles.js';
import { ScorePopup } from '../Components/ScorePopup.js';
import { Waypoint } from '../Components/WayPoint.js';
import { Box } from '../Utils/Box.js';

export class ComponentManager
{
    constructor(canvas,context)
    {
        this.canvas = canvas;
        this.context = context;
        this.wayPoints = new Waypoint(this.context);
        this.userGuide = new UserGuide(this.context);
        this.scorePopup = new ScorePopup(this.context);
        this.particles = new Particles(this.context, 'white');
    }

    init()
    {

    }

    updateComponent(deltaTime)
    {
        this.particles.update(deltaTime);
        this.scorePopup.update(deltaTime);
    }

    renderComponent()
    {
        this.particles.render();
        this.wayPoints.render();
        this.userGuide.render();
        this.scorePopup.render();
        
        
    }

    reset()
    {
        this.particles.clear();
        this.scorePopup.clear();
    }
}

