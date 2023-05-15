# ESP8266_Wasserstand

## Projektbeschreibung
Aufgabe war es, ein System zu entwerfen, welches einen Wassertank automatisch befüllt.
Wir sollten ein Kleines Modell dazu aufbauen, das Modell sollte an das Internet angeschlossen sein.

### Technische Umsetzung
Wasserstand Sensor mit ESP8266.
Der ESP8266 ist an einem Ultraschallsensor angeschlossen, und überträgt die Daten an ein Backend.

Das Backend ist in NodeJS geschrieben und speichert die Daten in einer CSV Datei und einem Datenbank Server (Pocketbase).

Das Backend eröffnet auch einen Webserver, welcher die Daten in einem Chart anzeigt.
