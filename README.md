# Maze3D

A navigable 3D maze written using CSS transitions. No canvas.

Every maze has 1 path from entrance to exit. Every place in the maze can be reached. No dead zones.

This was originally built back in 2011 after I read this article...
https://24ways.org/2010/intro-to-css-3d-transforms/

It was initially built using static js files and jQuery. This project is a modernization and enhancement of the original, which can be found in the `legacy` directory.

Live Demo
http://maze3d.apphb.com/

Images

## Local Setup

```sh
npm install
npm run dev
```

## TODO

- [ ] Reconstruct app off of vite instead of remix
- [x] Rebuild repo as an express server remix app
- [x] Tie Seed to psudo random number generation
- [x] 2D view - Bug when changing maze dimensions, character marker doesn't reset to entrance of the maze
- [x] 2D view - 2px maze outer border without closing off exits
- [x] 2D view - transitioning ball character to move around maze
- [ ] 2D view - improved entry and exit points
- [ ] 2D view - maze finished effect
- [ ] Construct 3D View
