import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class ComputeSHA {

	/* MAIN */
	public static void main(String[] args) throws IOException {
		/* CHECK FOR VALID NUMBER OF ARGUMENTS */
		if(args.length == 0) {
			System.err.println("Error: No file name given");
			System.out.println("Usage: java ComputerSHA <file_name>");
			System.exit(1);
		} 
		else if(args.length > 1) {
			System.err.println("Error: Too many arguments");
			System.out.println("Usage: java ComputerSHA <file_name>");
			System.exit(1);
		}

		/* INPUT STREAMS FOR READING FILE */
		FileInputStream fis = new FileInputStream(args[0]);
		// Use buffered read to read 8192 bytes at a time
		BufferedInputStream bis = new BufferedInputStream(fis);
		// Buffer for bis; read() from bis will read in 8192 bytes at a time (default)
		byte[] unhashed_buffer = new byte[8192];
		// Offset of string to read from for hash after buffer is appended in update()
		int offset = 0;
		// Number of bytes to read after offset for hash
		int bytes_read = 0;

		/* READ AND HASH FILE */
		try {
			// Select algorithm to use
			MessageDigest digest = MessageDigest.getInstance("SHA-256");

			// Loop while there are bytes left to read in file
			while(bis.available() > 0) {
				// Buffered read of file
				bytes_read = bis.read(unhashed_buffer);
				// Rehash after each buffer appended
				digest.update(unhashed_buffer, offset, bytes_read);
			}

			// Get the hash result in binary
			byte[] hashed_buffer = digest.digest();
			// Print the hexadecimal conversion of hash result
			System.out.println(hex(hashed_buffer));
		} 
		catch(NoSuchAlgorithmException e) {
			System.err.println("Error: SHA-256 hashing function not found");
			System.out.println("NoSuchAlgorithmException encountered");
		}

		/* CLOSE STREAMS */
		fis.close();
		bis.close();

		System.exit(0);
	}

	/* BINARY-TO-HEX CONVERSION FUNCTION */
	// Source: CS 144 Project Discussion
	public static String hex(byte[] bytes) {
		StringBuilder result = new StringBuilder();
		for(byte aByte : bytes) {
			int decimal = (int)aByte & 0xff;

			String hex = Integer.toHexString(decimal);
			if(hex.length() % 2 == 1) {
				hex = "0" + hex;
			}
			result.append(hex);
		}
		return result.toString();
	}
}
