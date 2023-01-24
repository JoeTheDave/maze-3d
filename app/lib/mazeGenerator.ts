import { Random } from '~/lib/random'
import mazeDefaults from '~/lib/mazeDefaults'

export class MazeSection {
  rand: Random
  id: number
  nNeighbor: MazeSection | null
  eNeighbor: MazeSection | null
  sNeighbor: MazeSection | null
  wNeighbor: MazeSection | null
  nWall: boolean
  eWall: boolean
  sWall: boolean
  wWall: boolean
  isEntrance: boolean
  isOnEntrancePath: boolean
  isExit: boolean
  isOnExitPath: boolean
  isOnMazePath: boolean
  distanceFromOpening: number
  x: number
  y: number

  constructor(id: number, rand: Random) {
    this.rand = rand
    this.id = id
    this.nNeighbor = null
    this.eNeighbor = null
    this.sNeighbor = null
    this.wNeighbor = null
    this.nWall = true
    this.eWall = true
    this.sWall = true
    this.wWall = true
    this.isEntrance = false
    this.isOnEntrancePath = false
    this.isExit = false
    this.isOnExitPath = false
    this.isOnMazePath = false
    this.distanceFromOpening = 0
    this.x = 0
    this.y = 0
  }

  wallCount() {
    let walls = 0
    if (this.nWall) {
      walls++
    }
    if (this.eWall) {
      walls++
    }
    if (this.sWall) {
      walls++
    }
    if (this.wWall) {
      walls++
    }
    return walls
  }

  neighborCount() {
    let neighbors = 0
    if (this.nNeighbor) {
      neighbors++
    }
    if (this.eNeighbor) {
      neighbors++
    }
    if (this.sNeighbor) {
      neighbors++
    }
    if (this.wNeighbor) {
      neighbors++
    }
    return neighbors
  }

  randomIsolatedNeighbor() {
    let options = []
    if (this.nNeighbor !== null && !this.nNeighbor.isOnEntrancePath && !this.nNeighbor.isOnExitPath) {
      options.push(this.nNeighbor)
    }
    if (this.eNeighbor !== null && !this.eNeighbor.isOnEntrancePath && !this.eNeighbor.isOnExitPath) {
      options.push(this.eNeighbor)
    }
    if (this.sNeighbor !== null && !this.sNeighbor.isOnEntrancePath && !this.sNeighbor.isOnExitPath) {
      options.push(this.sNeighbor)
    }
    if (this.wNeighbor !== null && !this.wNeighbor.isOnEntrancePath && !this.wNeighbor.isOnExitPath) {
      options.push(this.wNeighbor)
    }
    return options.length > 0 ? this.rand.randomSelection(options) : null
  }
}

interface MazeInput {
  dimensionX: number
  dimensionY: number
  mazeSegmentLength: number
  randomizer: Random
}
export class Maze {
  rand: Random
  dimX: number
  dimY: number
  sections: MazeSection[]
  wallSections: MazeSection[]
  cornerSections: MazeSection[]
  onPathSections: MazeSection[]
  mazeEntrance: MazeSection | null
  mazeExit: MazeSection | null
  mazeDistance: number
  currentPosition: MazeSection | null
  mazeSegmentLength: number

  constructor({ dimensionX, dimensionY, mazeSegmentLength, randomizer }: MazeInput) {
    this.rand = randomizer
    this.dimX = dimensionX
    this.dimY = dimensionY
    this.mazeDistance = 0
    this.sections = []
    this.wallSections = []
    this.cornerSections = []
    this.onPathSections = []
    this.mazeEntrance = null
    this.mazeExit = null
    this.currentPosition = null
    this.mazeSegmentLength = mazeSegmentLength
  }

  combineSections(section1: MazeSection, section2: MazeSection, progressive = true) {
    if (typeof progressive === 'undefined') {
      progressive = true
    }
    if (section1.nNeighbor !== null && section1.nNeighbor.id === section2.id) {
      section1.nWall = false
      section2.sWall = false
    } else if (section1.eNeighbor !== null && section1.eNeighbor.id === section2.id) {
      section1.eWall = false
      section2.wWall = false
    } else if (section1.sNeighbor !== null && section1.sNeighbor.id === section2.id) {
      section1.sWall = false
      section2.nWall = false
    } else if (section1.wNeighbor !== null && section1.wNeighbor.id === section2.id) {
      section1.wWall = false
      section2.eWall = false
    }
    if (progressive) {
      if (section1.isOnEntrancePath) {
        section2.isOnEntrancePath = true
      }
      if (section1.isOnExitPath) {
        section2.isOnExitPath = true
      }
      section2.distanceFromOpening = section1.distanceFromOpening + 1
    }
  }

  completeness() {
    return this.onPathSections.length / this.sections.length
  }

  pathFind(extender: MazeSection) {
    for (let x = 0; x < this.mazeSegmentLength; x++) {
      const next = extender.randomIsolatedNeighbor()
      if (next !== null) {
        this.combineSections(extender, next)
        this.onPathSections.push(next)
        extender = next
      } else {
        break
      }
    }
  }

  initialize() {
    //Create Maze Sections
    for (let x = 0; x < this.dimX * this.dimY; x++) {
      this.sections.push(new MazeSection(x, this.rand))
    }
    //InterLink Maze Sections
    for (let x = 0; x < this.sections.length; x++) {
      if ((x + 1) % this.dimX !== 0) {
        this.sections[x].eNeighbor = this.sections[x + 1]
      }
      if (x % this.dimX !== 0) {
        this.sections[x].wNeighbor = this.sections[x - 1]
      }
      if (x > this.dimX - 1) {
        this.sections[x].nNeighbor = this.sections[x - this.dimX]
      }
      if (x < this.dimX * this.dimY - this.dimX) {
        this.sections[x].sNeighbor = this.sections[x + this.dimX]
      }
    }
    //Make sections self aware of location withing grid
    for (let x = 0; x < this.sections.length; x++) {
      if (this.sections[x].nNeighbor !== null) {
        this.sections[x].y = (this.sections[x].nNeighbor as MazeSection).y + 1
      }
      if (this.sections[x].wNeighbor !== null) {
        this.sections[x].x = (this.sections[x].wNeighbor as MazeSection).x + 1
      }
    }
    //identify Maze Walls and Corners
    let section = this.sections[0]
    let dir = 1
    do {
      this.wallSections.push(section)
      if (dir === 1) {
        if (section.eNeighbor !== null) {
          section = section.eNeighbor
        } else {
          dir = 2
        }
      }
      if (dir === 2) {
        if (section.sNeighbor !== null) {
          section = section.sNeighbor
        } else {
          dir = 3
        }
      }
      if (dir === 3) {
        if (section.wNeighbor !== null) {
          section = section.wNeighbor
        } else {
          dir = 4
        }
      }
      if (dir === 4) {
        if (section.nNeighbor !== null) {
          section = section.nNeighbor
        } else {
          dir = 1
        }
      }
    } while (section.id !== 0)
    //Place Maze Entrance/Exit
    this.mazeEntrance = null
    this.mazeExit = null
    while (this.mazeEntrance === null) {
      let attempt = this.rand.range(0, this.wallSections.length) as number
      if (this.wallSections[attempt].neighborCount() === 3) {
        this.mazeEntrance = this.wallSections[attempt]
        this.mazeEntrance.isEntrance = true
        this.mazeEntrance.isOnEntrancePath = true
        this.onPathSections.push(this.mazeEntrance)
        if (this.mazeEntrance.nNeighbor === null) {
          this.mazeEntrance.nWall = false
        }
        if (this.mazeEntrance.eNeighbor === null) {
          this.mazeEntrance.eWall = false
        }
        if (this.mazeEntrance.sNeighbor === null) {
          this.mazeEntrance.sWall = false
        }
        if (this.mazeEntrance.wNeighbor === null) {
          this.mazeEntrance.wWall = false
        }
        this.mazeExit =
          this.wallSections[
            attempt + this.wallSections.length / 2 > this.wallSections.length - 1
              ? attempt + this.wallSections.length / 2 - this.wallSections.length
              : attempt + this.wallSections.length / 2
          ]
        this.mazeExit.isExit = true
        this.mazeExit.isOnExitPath = true
        this.onPathSections.push(this.mazeExit)
        if (this.mazeExit.nNeighbor === null) {
          this.mazeExit.nWall = false
        }
        if (this.mazeExit.eNeighbor === null) {
          this.mazeExit.eWall = false
        }
        if (this.mazeExit.sNeighbor === null) {
          this.mazeExit.sWall = false
        }
        if (this.mazeExit.wNeighbor === null) {
          this.mazeExit.wWall = false
        }
      }
    }
    //Build Maze Path
    this.pathFind(this.mazeEntrance as MazeSection)
    this.pathFind(this.mazeExit as MazeSection)
    do {
      let proposedSection = null
      while (proposedSection === null) {
        proposedSection = this.rand.randomSelection<MazeSection>(this.onPathSections)
        if (proposedSection.randomIsolatedNeighbor() === null) {
          proposedSection = null
        }
      }
      this.pathFind(proposedSection)
    } while (this.completeness() < 1.0)
    //Connect Entrance and Exit Paths
    let section1 = null
    let section2 = null
    let distance = 0
    for (let x = 0; x < this.sections.length; x++) {
      if (
        this.sections[x].eNeighbor !== null &&
        ((this.sections[x].isOnEntrancePath && (this.sections[x].eNeighbor as MazeSection).isOnExitPath) ||
          (this.sections[x].isOnExitPath && (this.sections[x].eNeighbor as MazeSection).isOnEntrancePath))
      ) {
        if (
          this.sections[x].distanceFromOpening + (this.sections[x].eNeighbor as MazeSection).distanceFromOpening >
          distance
        ) {
          distance =
            this.sections[x].distanceFromOpening + (this.sections[x].eNeighbor as MazeSection).distanceFromOpening
          section1 = this.sections[x]
          section2 = this.sections[x].eNeighbor
        }
      }
      if (
        this.sections[x].sNeighbor !== null &&
        ((this.sections[x].isOnEntrancePath && (this.sections[x].sNeighbor as MazeSection).isOnExitPath) ||
          (this.sections[x].isOnExitPath && (this.sections[x].sNeighbor as MazeSection).isOnEntrancePath))
      ) {
        if (
          this.sections[x].distanceFromOpening + (this.sections[x].sNeighbor as MazeSection).distanceFromOpening >
          distance
        ) {
          distance =
            this.sections[x].distanceFromOpening + (this.sections[x].sNeighbor as MazeSection).distanceFromOpening
          section1 = this.sections[x]
          section2 = this.sections[x].sNeighbor
        }
      }
    }
    this.mazeDistance = distance
    this.combineSections(section1 as MazeSection, section2 as MazeSection, false)
    this.currentPosition = this.mazeEntrance
    //Define Actual Maze Path
    let cursor: MazeSection = section1 as MazeSection
    while (cursor.distanceFromOpening > 0) {
      cursor.isOnMazePath = true
      if (
        cursor.nWall === false &&
        cursor.nNeighbor !== null &&
        cursor.nNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.nNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.nNeighbor
      } else if (
        cursor.eWall === false &&
        cursor.eNeighbor !== null &&
        cursor.eNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.eNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.eNeighbor
      } else if (
        cursor.sWall === false &&
        cursor.sNeighbor !== null &&
        cursor.sNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.sNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.sNeighbor
      } else if (
        cursor.wWall === false &&
        cursor.wNeighbor !== null &&
        cursor.wNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.wNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.wNeighbor
      }
    }
    cursor = section2 as MazeSection
    while (cursor.distanceFromOpening > 0) {
      cursor.isOnMazePath = true
      if (
        cursor.nWall === false &&
        cursor.nNeighbor !== null &&
        cursor.nNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.nNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.nNeighbor
      } else if (
        cursor.eWall === false &&
        cursor.eNeighbor !== null &&
        cursor.eNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.eNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.eNeighbor
      } else if (
        cursor.sWall === false &&
        cursor.sNeighbor !== null &&
        cursor.sNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.sNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.sNeighbor
      } else if (
        cursor.wWall === false &&
        cursor.wNeighbor !== null &&
        cursor.wNeighbor.isOnEntrancePath === cursor.isOnEntrancePath &&
        cursor.wNeighbor.distanceFromOpening === cursor.distanceFromOpening - 1
      ) {
        cursor = cursor.wNeighbor
      }
    }
  }

  getSections() {
    return this.sections.map(section => {
      const mappedSection = {
        ...section,
        nNeighbor: section.nNeighbor?.id ?? null,
        eNeighbor: section.eNeighbor?.id ?? null,
        sNeighbor: section.sNeighbor?.id ?? null,
        wNeighbor: section.wNeighbor?.id ?? null,
      }
      return mappedSection
    })
  }
}

export interface MazeData
  extends Omit<
    MazeSection,
    'nNeighbor' | 'eNeighbor' | 'sNeighbor' | 'wNeighbor' | 'wallCount' | 'neighborCount' | 'randomIsolatedNeighbor'
  > {
  nNeighbor: number | null
  eNeighbor: number | null
  sNeighbor: number | null
  wNeighbor: number | null
}

export interface MazeOptions {
  width?: number
  height?: number
  seed: string
  segLength?: number
}

export const mazeGenerator = {
  generate: ({ seed, width, height, segLength }: MazeOptions): MazeData[] => {
    const randomizer = new Random(seed)
    const maze = new Maze({
      dimensionX: width || mazeDefaults.defaultWidth,
      dimensionY: height || mazeDefaults.defaultHeight,
      mazeSegmentLength: segLength || mazeDefaults.defaultSegmentLength,
      randomizer,
    })
    maze.initialize()
    return maze.getSections()
  },
}
