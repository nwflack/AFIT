package BattleShip;
import BattleShip.Client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class GameManager
{
	private ArrayList<Client> clients = new ArrayList<Client>();
	private ServerSocket listener = null;
	
	public GameManager()
	{		
	}
	
	public Client getOpponent( Client me )
	{
		Client dst = null; //dst is the client destined to receive an inbound missile
		if( clients.get(0) == me )
			dst = clients.get(1);
		else
			dst = clients.get(0);
		return dst;
	}
	
	public void playGame()
	{
		//Each player may begin firing missiles at the other player. First player to lose all ships is the loser.
		//Asynchronously process missile fire commands from each player		
		clients.parallelStream().forEach( client -> 
		{
			try{ client.playGame(); }
			catch( IOException e ) { e.printStackTrace(); } 
		} );
		
	}
	
	boolean waitFor2PlayersToConnect() throws IOException
	{
		try
		{
		    this.listener = new ServerSocket( 10000 );
		    while( clients.size() < 2 )
		    {
		    	Socket clientSocket = listener.accept();
			    PrintWriter out = new PrintWriter( clientSocket.getOutputStream(), true );
			    BufferedReader in = new BufferedReader( new InputStreamReader(clientSocket.getInputStream() ) );
			    Client c = new Client( in, out, this );
			    clients.add( c );
			    System.out.println( "A client has joined..." );
			    out.println( "           ...Welcome to Battleship..." ); 
			    out.println( "   Please wait for other player to join.");
		    }
		    return true;
		}
		finally
		{
			System.out.println( "Done listening for clients to join into Battleship game..." );
		}
	}
	
	void initPlayers() throws IOException
	{
		//Asynchronously perform player initialization
		clients.parallelStream().forEach( client ->
		{
			try { client.initPlayer(); }
			catch (IOException e) { e.printStackTrace(); }
		} );
	}
	
	public static void main( String [] args ) throws IOException
	{
		GameManager m = new GameManager();
		
		System.out.println( "<<<---BattleShip--->>>" );
		System.out.println( "Waiting for two players to connect to TCP:10000" );
		m.waitFor2PlayersToConnect();
		System.out.println( "Clients have joined!!!");		
		m.initPlayers();
		System.out.println( m.clients.get(0).getName() + " vs " + m.clients.get(1).getName() + " Let's Rumble..." );
		m.playGame();		
		System.out.println( "Shutting down server now... Disconnecting Clients..." );
	}

}
