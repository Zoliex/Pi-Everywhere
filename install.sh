#!/bin/bash

echo "Mise à jour système..."
sudo apt update -y
sudo apt upgrade -y
echo "Done"

echo "Installation des dépendances et suppressions des logiciels inutiles..."
sudo apt purge wolfram-engine scratch scratch2 nuscratch sonic-pi idle3 -y
sudo apt purge smartsim java-common minecraft-pi libreoffice* -y
sudo apt clean
sudo apt autoremove -y

sudo apt install chromium-browser -y
sudo apt install unclutter sed -y

curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash -
sudo apt install nodejs -y
sudo apt install build-essential -y
sudo apt install gcc g++ make
sudo npm install -g npm@latest
sudo npm install pm2 nodemon -g
echo "Done"

echo "Remplacement de l'écran de démarrage..."
sudo mv /usr/share/plymouth/themes/pix/splash.png /usr/share/plymouth/themes/pix/splash.png.bk
sudo cp ./splash.png /usr/share/plymouth/themes/pix/
echo "Done"

echo "Remplacement du fond d'écran"
chmod +x ./change-background.sh
./change-background.sh

echo "Installation du mode kiosk"
sudo mkdir /home/kiosk
sudo cp ./kiosk.sh /home/kiosk/kiosk.sh
sudo chmod u+x /home/kiosk/kiosk.sh

sudo cp ./kiosk-service.service /lib/systemd/system/kiosk.service
sudo systemctl enable kiosk.service
sudo systemctl start kiosk.service
sudo systemctl status kiosk.service

echo "Installation du driver pour l'écran LCD 5\""
cd /home/
sudo rm -rf LCD-show
sudo git clone https://github.com/goodtft/LCD-show.git
sudo chmod -R 755 LCD-show
cd LCD-show/
sudo ./LCD5-show
echo "Done"

printf 'Voulez-vous installer RaspAP (y/n) (recommendé)? '
old_stty_cfg=$(stty -g)
stty raw -echo
answer=$( while ! head -c 1 | grep -i '[ny]' ;do true ;done )
stty $old_stty_cfg
if echo "$answer" | grep -iq "^y" ;then
    echo "Installing RaspAP..."
    curl -sL https://install.raspap.com | sudo bash
    echo "Done"
    echo "Following a reboot, the wireless AP network will be configured as follows:"
    echo "IP address: 10.3.141.1"
    echo "Username: admin"
    echo "Password: secret"
    echo "DHCP range: 10.3.141.50 — 10.3.141.255"
    echo "SSID: raspi-webgui"
    echo "Password: ChangeMe"
    echo "Hostname: "
    hostname -I
else
    echo "n"
fi

echo "dtparam=act_led_gpio=18" | sudo tee -a /boot/config.txt
echo "Installation Terminée entrez |sudo reboot| pour redémarrer" 
