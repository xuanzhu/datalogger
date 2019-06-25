vessels = ['DLF', 'AUD', 'LOR', 'PSC', 'SOL', 'TGM']
deployTestingEnvironments = [:]

vessels.each {
  deployTestingEnvironments[it] = {
    try {
      createVersionForVessel(it)
      executeRobocopy(it, getLocationForVessel(it))
    } catch (error) {
      currentBuild.result = 'FAILURE'
    }
  }
}

def createVersionForVessel(vessel) {
  powershell """
    Copy-Item ./dist -Destination ./dist_${vessel} -Recurse
    (Get-Content ./dist_${vessel}/index.html) -replace 'window.VESSEL = \"(\\w+)\"', 'window.VESSEL = \"${vessel.toLowerCase()}\"' | Set-Content ./dist_${vessel}/index.html
    (Get-Content ./dist_${vessel}/index.html) -replace 'window.IS_RUNNING_ON_VESSEL = (\\w+)', 'window.IS_RUNNING_ON_VESSEL = ${isRunningOnVessel(vessel)}' | Set-Content ./dist_${vessel}/index.html
  """
}

def executeRobocopy(vessel, target) {
  bat """
    Robocopy .\\dist_${vessel} ${target} /R:5 /W:1 /MIR /MT:32
    IF %ERRORLEVEL% LSS 8 (EXIT 0) ELSE (EXIT %ERRORLEVEL%)
  """
}

def getLocationForVessel(vessel) {
  switch(vessel.toUpperCase()) {
    case 'AUD':
      return '\\\\AUDWEB01\\datalogger-next'
    case 'DLF':
      return '\\\\DLFWEB01\\datalogger-next'
    case 'LOR':
      return '\\\\LORWEB01\\datalogger-next'
    case 'PSC':
      return '\\\\PSCWEB02\\datalogger-next'
    case 'SOL':
      return '\\\\SOLWEB01\\datalogger-next'
    case 'TGM':
      return '\\\\TGMWEB01\\datalogger-next'
    break
  }
}

def isRunningOnVessel(vessel) {
  switch(vessel.toUpperCase()) {
    case 'DLF':
      return 'false'
    default:
      return 'true'
    break
  }
}

pipeline {
  agent {
    node {
      label ""
      customWorkspace "C:\\Jenkins\\Datalogger_Angular_Trial\\${env.BRANCH_NAME}"
    }
  }

  stages {
    stage("Install dependencies") {
      steps {
        bat "npm ci"
      }
    }

    stage("Test") {
      steps {
        bat "npm run lint"
        bat "npm run test-headless"
      }
    }

    stage("Build") {
      steps {
        bat "npm run build"
      }
    }

    stage("Deploy to testing") {
      when {
        branch "develop"
      }
      steps {
        script {
          parallel deployTestingEnvironments
        }
      }
    }

    // stage("Deploy to production") {
    //   when {
    //     branch "master"
    //   }
    //   steps {
    //     script {
    //       parallel deploysProduction
    //     }
    //   }
    // }
  }
}
