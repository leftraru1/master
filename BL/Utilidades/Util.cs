using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Utilidades
{
    public class Util
    {
     
        public static string GetIpServer()
        {
            string myHost = System.Net.Dns.GetHostName();
            string myIPas = System.Net.Dns.GetHostEntry(myHost).AddressList[0].ToString();
            int WebServer = 0;

            foreach (System.Net.IPAddress Ip in System.Net.Dns.GetHostEntry(myHost).AddressList)
            {
                myIPas = Ip.ToString();
                if ((myIPas.Split('.').Length == 4))
                    break;
            }

            try
            {
                
                //WebServer = int.Parse(myIPas.Remove('.'));
                return Convert.ToString(myIPas);
            }
            catch (Exception ex)
            {
            }
            return Convert.ToString(WebServer);
        }


        public static string GetToalIpServer()
        {
            string myHost = System.Net.Dns.GetHostName();
            Byte[] bytes = System.Net.Dns.GetHostEntry(myHost).AddressList[0].GetAddressBytes();
            int ipf = bytes[3];
            string myIPas = ipf.ToString();
            bool isvalid = false;
            string strip = "";

            myIPas = "";
            foreach (System.Net.IPAddress Ip in System.Net.Dns.GetHostEntry(myHost).AddressList)
            {
                myIPas = myIPas + " - ";
                bytes = System.Net.Dns.GetHostEntry(myHost).AddressList[0].GetAddressBytes();
                for (int i = 0; i <= 3; i++)
                {
                    ipf = bytes[0];
                    myIPas = myIPas + "." + ipf.ToString();
                }
                myIPas = myIPas + ":" + Ip.ToString();
            }


            return myHost + " " + myIPas;
        }
    }
}
