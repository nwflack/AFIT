package BattleShip;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

public class Client
{
	final String NEWL = System.getProperty("line.separator");
	
	private String name = "Player";
	PrintWriter out = null;
	BufferedReader in = null;
	GameManager man = null;
	GameBoard board = new GameBoard(10,10);
	GameBoard targets = new GameBoard(10,10);
	
	Client( BufferedReader in, PrintWriter out, GameManager manager )
	{
		this.in = in;
		this.out = out;
		this.man = manager;
	}
	
	public void playGame() throws IOException
	{
		this.out.println( NEWL + NEWL + "   Missiles Away! Game has begun" );
		this.out.println( "   To Launch a missle at your enemy:" );
		this.out.println( "F 2 4" );
		this.out.println( "Fires a missile at coordinate x=2, y=4." );
		
		while( this.processCommand() )
		{
			out.println( "------------------------" );
			out.println( "Target Board:" + this.targets.draw() );
			out.println( "Your Ships: " + this.board.draw() );
			out.println( "   Waiting for Next Command...\n\n" );
			out.flush();
			
			if( this.allEnemyShipsAreDestroyed() )
			{
				this.out.println( "YOU HAVE WON! ALL ENEMY SHIPS ARE SUNK!!!" );
				break;
			}
			if( this.allMyShipsAreDestroyed() )
			{
				this.out.println( "YOU HAVE LOST! ALL YOUR SHIPS ARE SUNK!!!" );
				break;
			}
		}
	}
	
	boolean allMyShipsAreDestroyed()
	{
		boolean atLeastOneShipAlive = false;
		for( Ship s : this.board.myShips )
		{
			if( s.isAlive() )
			{
				atLeastOneShipAlive = true;
				break;
			}
		}
		return !atLeastOneShipAlive;
	}
	
	boolean allEnemyShipsAreDestroyed()
	{
		ArrayList<Ship> es = this.man.getOpponent(this).board.myShips; //enemy ships
		boolean atLeastOneShipAlive = false;
		for( Ship s : es )
		{
			if( s.isAlive() )
			{
				atLeastOneShipAlive = true;
				break;
			}
		}
		return !atLeastOneShipAlive;
	}
	
	boolean processCommand() throws IOException
	{
		String l = this.in.readLine();
		String [] s = l.split( "\\s+" );
		if( s[0].equals("F" ) )
			return this.processFireCmd( s );
		else if( s[0].equals( "C" ) )
			return this.processChatCmd( l );
		else if( s[0].equals( "D" ) )
			; //screen will redraw after this command completes processing, we don't have to do anything
		else
		{
			out.println("Received invalid command... Ignoring");
		}
		return true;		
	}
	
	boolean processFireCmd( String [] s )
	{
		Position p = new Position( Integer.parseInt( s[1] ), Integer.parseInt( s[2] ) );
		this.targets.fireMissle(p); //mark on target board where missile was fired
		Ship victimShip = this.man.getOpponent(this).getGameBoard().fireMissle( p );
		if( victimShip != null )
		{
			this.out.println( "Direct Strike to " + victimShip.getName() + "... Ouch..." );
			if(! victimShip.isAlive() )
				this.out.println( victimShip.getName() + " is swimming with the fishes..." );	
		}
		else
			this.out.println( "Missile Missed!!!" );
		
		return true;
	}
	
	boolean processChatCmd( String s )
	{
		if( s.length() >= 2)
		{
			this.man.getOpponent(this).out.println("Opponent Chat: " + s.substring(1).toString() );
			this.man.getOpponent(this).out.flush();
		}
		return true;
	}
	
	GameBoard getGameBoard() { return this.board; }
	
	public void initPlayer() throws IOException
	{
		out.println("Enter Player Name:");
		out.flush();
		this.name = in.readLine();
		
		out.println("   You will now place 2 ships. You may choose between either a Cruiser (C) " );
		out.println("   and Destroyer (D)...");
		out.println("   Enter Ship info. An example input looks like:");
		out.println("\nD 2 4 S USS MyBoat\n");
		out.println("   The above line creates a Destroyer with the stern located at x=2 (col)," );
		out.println("   y=4 (row) and the front of the ship will point to the SOUTH (valid" );
		out.println("   headings are N, E, S, and W.\n\n" );
		out.println("   the name of the ship will be \"USS MyBoat\"");
		out.println("Enter Ship 1 information:" );
		out.flush();
		
		int numShipsAdded = 0;
		while( numShipsAdded < 2 )
		{
			String c = in.readLine();
			String [] s = c.split( " ", 5 );
			String type = s[0];
			int x = Integer.parseInt( s[1] );
			int y = Integer.parseInt( s[2] );
			String heading = s[3];
			
			HEADING h;
			if( heading.equals( "N") ) h 	   = HEADING.NORTH;
			else if( heading.equals( "E" ) ) h = HEADING.EAST;
			else if( heading.equals( "S" ) ) h = HEADING.SOUTH;
			else h = HEADING.WEST;
			
			Ship ship = null;
			if( type.equals( "C" ) )
				ship = new Cruiser( s[4] );
			else if( type.equals( "D" ) )
				ship = new Destroyer( s[4] );
			else
			{
				System.out.println( "Invalid command" );
				out.println( "Invalid command...");
				out.flush();
			}
			if( this.board.addShip( ship, new Position(x, y), h ) )
			{
				numShipsAdded++;
				out.println("Added ship " + ship.getName() + " successfully..." );
			}
			else
				out.println("FAILED TO ADD SHIP - It either exits game board OR collides with exsting ship!" );
			out.println( this.board.draw() );
			out.flush();
		}
		
		System.out.println( "\n\n\nPlayer initialization is complete!!! Your Gameboard looks like:\n" );
		out.println( this.board.draw() );
		out.flush();
		System.out.println( "Waiting for other player to finish their setup, then war will ensue!" );
	}
	
	String getName() { return this.name; }
	
	public static void main( String [] args )
	{
		
		
	}
}
