pipeline {
    agent any

    environment {
        SSH_TARGET = "bernhardantl@192.168.178.60"
        TARGET_DIR = "/var/www/BernhardsWeb"
    }

    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'TAG_NAME', value: '$.ref']
            ],
            causeString: 'Triggered by Tag: $TAG_NAME',
            token: 'mein-geheimes-projekt-token',
            printPostContent: true,
            // Filter: Nur auslösen, wenn "refs/tags/" im Namen vorkommt
            regexpFilterText: '$TAG_NAME',
            regexpFilterExpression: '^refs/tags/.*'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                // Holt den Code des aktuellen Tags
                checkout scm
            }
        }
        
    stage('Replace Variables') {
        steps {
            script {
                /*
                   Die Konfigurationsdatei "config.properties" liegt auf dem Jenkins-Server
                   unter dem Pfad "/var/lib/jenkins/my-configs/config.properties".
                */

                // Pfad zur Datei auf deinem Jenkins-Server
                def serverConfigPath = "/var/lib/jenkins/my-configs/config.properties"

                // Datei in den aktuellen Workspace kopieren
                sh "cp ${serverConfigPath} ."

                // Jetzt kann readProperties die Datei im Workspace finden
                def props = readProperties file: 'config.properties'
                def mail = props['EMAIL']
                def tel = props['TELNR']

                echo "--- Geladene Konfiguration vom Server ---"
                echo "E-Mail: ${mail}"
                echo "Telefon: ${tel}"
                echo "-----------------------------------------"

                // Variablen im HTML ersetzen
                def rawTag = env.TAG_NAME ?: 'v0.0.0'
                def cleanVersion = rawTag.replace('refs/tags/', '')
                def buildYear = new Date().format('yyyy')

                sh """
                    sed -i 's/{{VERSION}}/${cleanVersion}/g' index.html
                    sed -i 's/{{EMAIL}}/${mail}/g' index.html
                    sed -i 's/{{TELNR}}/${tel}/g' index.html
                    sed -i 's/{{YEAR}}/${buildYear}/g' index.html
                """
                
                // Optional: Datei wieder aus dem Workspace löschen, damit sie nicht mit-deployed wird
                sh "rm config.properties"
            }
        }
    }
        

        stage('Deploy to Nginx') {
            steps {
                sshagent(['nginx-server-ssh']) {
                    // rsync mit mehreren Excludes für Scripts und Git-Daten
                    sh """
                        rsync -avz -e 'ssh -o StrictHostKeyChecking=no' \
                        --exclude='.git*' \
                        --exclude='*.cmd' \
                        --exclude='*.ps1' \
                        --exclude='*.sh' \
                        --exclude='Jenkinsfile' \
                        . ${SSH_TARGET}:${TARGET_DIR}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment erfolgreich abgeschlossen!'
        }
        failure {
            echo 'Deployment fehlgeschlagen!'
        }
    }
}