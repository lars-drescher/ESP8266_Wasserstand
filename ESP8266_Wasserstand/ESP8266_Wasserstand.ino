#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>

#define TRIGPIN 12
#define ECHOPIN 14
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels

#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

long dauer = 0;
float entfernung = 0.0;
String waterlevel = "";

// Name und Passwort des Access Points
const char* ssid = "ESP_FLM";
const char* password = "Test1234!";

// Port, auf dem der Socketserver lauschen soll
WiFiServer server(80); 

void setup() {
  Serial.begin(115200);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);

  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.display();
  delay(2000); // Pause for 2 seconds

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
  write_text("{\"waterLevel\":" + String(fillState) + ",\"distance\":"+ String(entfernung) + "}");
  print_display("Wasserstand: "+ String(fillState) + "% | Entfernung: " + String(entfernung));
}

void fill(float fillState) {

    while(fillState < 99.99) {
        fillState = getFillPercentage();

        // Wasserstand wird gefüllt
        write_text("{\"waterLevel\":" + String(fillState) + ",\"distance\":"+ String(entfernung) + "}");
        print_display("Wasserstand: "+ String(fillState) + "% | Entfernung: " + String(entfernung));
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

    String response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n";
    response += text;
//  response += "<script>window.setTimeout( function() { window.location.reload();}, 500);</script>";

  Serial.println(response);
  Serial.println(text);
  client.print(response);

  // Warte kurz, damit der Client alle Daten empfangen kann
  delay(1);
  client.stop();  
}

void print_display(String text) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  
  display.println(text);

  display.display();
  delay(2000);
}
