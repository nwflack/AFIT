package BattleShip;
import java.util.ArrayList;

public class GameBoard
{
	int rowCount = 10;
	int colCount = 10;
	
	final String LINE_END = System.getProperty("line.separator"); 
	
	ArrayList< ArrayList<Cell> > cells;
	ArrayList< Ship > myShips = new ArrayList<Ship>();
	
	public GameBoard( int rowCount, int colCount )
	{
		this.rowCount = rowCount;
		this.colCount = colCount;

		int i = 0;
		int j = 0;

		//ArrayList[][] = new ArrayList[rowCount][colCount];
		cells = new ArrayList<ArrayList<Cell>>();
		//create the 2D array of cells
		for (int i = 0; i < rowCount; i++) {
			//initalize each column
			cells.add(new ArrayList<Cell>())
			//inialize a Cell in each row for each column
			for (int j = 0; j < colCount; j++) {
				cells.get(i).add(new Cell());
			}
		}
	}

	//ArrayList<Cell> cells = new ArrayList<cell>:
	//cells.get(i).new Cell();


	public String draw()
	{
		StringBuilder line = new StringBuilder();

		line.append("+----------+\n");


		for(int i=0; i<rowCount; i++) {
			line.append("|")
			for (int j=0; j<colCount; j++) {
				cells.get(i).get(j).draw();
			}
			line.append("|\n");
		}
		line.append("+----------+\n");

		return line.toString();

		//draw the entire board... I'd use a StringBuilder object to improve speed
		//remember - you must draw one entire row at a time, and don't forget the
		//pretty border...
		//include char drawShipStatusAtCell( boolean isDamaged );
		//if it is damaged draw a lower-case letter, if not damaged upper case letter
	}
	
	//add in a ship if it fully 1) fits on the board and 2) doesn't collide w/
	//an existing ship.
	//Returns true on successful addition; false, otherwise
	public boolean addShip( Ship s , Position sternLocation, HEADING bowDirection )
	{
		
	}
	
	//Returns A reference to a ship, if that ship was struck by a missle.
	//The returned ship can then be used to print the name of the ship which
	//was hit to the player who hit it.
	//Ensure you handle missiles that may fly off the grid
	public Ship fireMissle( Position coordinate )
	{
		
	}
	
	//Here's a simple driver that should work without touching any of the code below this point
	public static void main( String [] args )
	{
		System.out.println( "Hello World" );
		GameBoard b = new GameBoard( 10, 10 );	
		System.out.println( b.draw() );
		
		Ship s = new Cruiser( "Cruiser" );
		if( b.addShip(s, new Position(3,6), HEADING.WEST ) )
			System.out.println( "Added " + s.getName() + "Location is " );
		else
			System.out.println( "Failed to add " + s.getName() );
		
		s = new Destroyer( "Vader" );
		if( b.addShip(s, new Position(3,5), HEADING.NORTH ) )
			System.out.println( "Added " + s.getName() + "Location is " );
		else
			System.out.println( "Failed to add " + s.getName() );
		
		System.out.println( b.draw() );
		
		b.fireMissle( new Position(3,5) );
		System.out.println( b.draw() );
		b.fireMissle( new Position(3,4) );
		System.out.println( b.draw() );
		b.fireMissle( new Position(3,3) );
		System.out.println( b.draw() );
		
		b.fireMissle( new Position(0,6) );
		b.fireMissle( new Position(1,6) );
		b.fireMissle( new Position(2,6) );
		b.fireMissle( new Position(3,6) );
		System.out.println( b.draw() );
		
		b.fireMissle( new Position(6,6) );
		System.out.println( b.draw() );
	}

}
