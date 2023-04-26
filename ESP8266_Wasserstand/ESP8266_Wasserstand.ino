#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>

#define TRIGPIN 12
#define ECHOPIN 14

long dauer = 0;
float entfernung = 0.0;

// Name und Passwort des Access Points
const char* ssid = "ESP_FLM";
const char* password = "Test1234!";

// Port, auf dem der Socketserver lauschen soll
WiFiServer server(80); 

void setup() {
  Serial.begin(115200);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);

  // Access Point einrichten
  WiFi.softAP(ssid, password);
  IPAddress ip = WiFi.softAPIP();

  Serial.println("IP-Adresse des Access Points: ");
  Serial.print(ip);

  // Server starten
  server.begin();
  Serial.println("Server gestartet.");

}

void loop() {

  // if (getFillPercentage() < 25.00) {
  //   // Wasserstand ist unter 25%
  //   write_text("Achtung: Wasserstand unter 25%");

  //   fill(getFillPercentage());

  // }


  // Sende eine HTTP-Antwort mit dem Sensorwert
  float fillState = getFillPercentage();

  // Ausgabe Sensorwert
  write_text("Wasserstand: "+ String(fillState) + "% <br>Entfernung: " + String(entfernung));
}

void fill(float fillState) {

    while(fillState < 99.99) {
        fillState = getFillPercentage();

        // Wasserstand wird gefüllt
        write_text("Wasserstand: "+ String(fillState) + "%");
        delay(100);
    }

    // Wasserstand wieder bei 100%
    write_text("Wasserstand wieder bei 100%");
}

float getFillPercentage() {
  digitalWrite(TRIGPIN, LOW); //Hier nimmt man die Spannung für kurze Zeit vom Trigger-Pin, damit man später beim Senden des Trigger-Signals ein rauschfreies Signal hat.
  delay(5); //Dauer: 5ms
  digitalWrite(TRIGPIN, HIGH); //Jetzt sendet man eine Ultraschallwelle los.
  delay(10); // Dauer: 10ms
  digitalWrite(TRIGPIN, LOW); 

  dauer = pulseIn(ECHOPIN, HIGH); //Mit dem Befehl „pulseIn“ zählt der Mikrokontroller die Zeit in Mikrosekunden, bis der Schall zum Ultraschallsensor zurückkehrt.
  entfernung = (dauer/2) * 0.03432;

  if(entfernung >= 8.9) {
    return 0;
  }

  float entfernungInProzent = (8.9 - entfernung) / 0.062;
  return entfernungInProzent;
}

void write_text(String text) {
  // Warte auf Verbindung mit einem Client
  WiFiClient client = server.available();

  if (!client) {
    return;
  }

  String response = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n";
  response += "<!DOCTYPE HTML>\r\n<html>\r\n";
  response += "<h1>";
  response += text;
  response += "</h1>\r\n";
  response += "<script>window.setTimeout( function() { window.location.reload();}, 500);</script>";
  response += "</html>\n";

  client.print(response);

  // Warte kurz, damit der Client alle Daten empfangen kann
  delay(1);
  client.stop();  
}