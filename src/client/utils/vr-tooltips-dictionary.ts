export const vrTooltipDictionary = {
    'AE': ['Application Entity', 'Default Character Repertoire excluding character ' +
        'code 5CH (the BACKSLASH "\\" in ISO-IR 6), and ' +
        'control characters LF, FF, CR and ESC\nMax length 16 bytes'],

    'AS': ['Age String', 'A string of characters with one of the following ' +
        'formats -- nnnD, nnnW, nnnM, nnnY; where nnn shall ' +
        'contain the number of days for D, weeks for W, months for M, or years for Y.' +
        '\nExample: "018M" would represent an age of 18 months.\nLength of 4 bytes fixed'],

    'AT': ['Attribute Tag', 'Example: A Data Element Tag of 0018,00FF or 001800FF or 0018 00FF ' +
        'commas and spaces will automaticaly get removed\nLength of 4 bytes fixed'],

    'CS': ['Code String', 'Uppercase characters, "0"-"9", the SPACE character, and underscore "_", of ' +
        'the Default Character Repertoire\nMax length 16 bytes'],

    'DA': ['Date', '"0"-"9" of Default Character Repertoire\nA string of characters of the format YYYYMMDD; where ' +
        'YYYY shall contain year, MM shall contain the month, and DD shall contain the day, interpreted as ' +
        'a date of the Gregorian calendar system.\nExample: "19930822" would represent August 22, 1993.'],

    'DS': ['Decimal String', '"0"-"9", "+", "-", "E", "e", "." of Default Character ' +
        'Repertoire\nA string of characters ' +
        'representing either a fixed point number or a floating point number. A fixed point number shall ' +
        'contain only the characters 0-9 with an optional leading "+" or "-" and an optional "." to mark the ' +
        'decimal point.\n16 bytes maximum'],

    'DT': ['Date Time', '"0"-"9", "+", "-", "." and the SPACE character of Default Character Repertoire\n' +
        'A concatenated date-time character string in the format: YYYYMMDDHHMMSS.FFFFFF&ZZXX\nThe components ' +
        'of this string, from left to right, are YYYY = Year, MM = Month, DD = Day, HH = Hour (range "00" - "23") ' +
        ', MM = Minute (range "00" - "59"), SS = Second (range "00" - "60").\nFFFFFF = Fractional Second contains ' +
        'a fractional part of a second as small as 1 millionth of a second (range "000000" - "999999"). ' +
        '&ZZXX is an optional suffix for offset from Coordinated Universal Time (UTC), where & = "+" or "-", ' +
        'and ZZ = Hours and XX = Minutes of offset.'],

    'FL': ['Floating Point Single', 'Single precision binary floating point number ' +
        'represented in IEEE 754:1985 32-bit Floating Point ' +
        'Number Format.\n4 bytes fixed'],

    'FD': ['Floating Point Double', 'Double precision binary floating point ' +
        'number represented in IEEE 754:1985 64-bit ' +
        'Floating Point Number Format.\n8 bytes fixed'],

    'IS': ['Integer String', '"0"-"9", "+", "-" of Default Character Repertoire\nIn ' +
        'range -2^31<= n <= (2^31-1).\n12 bytes maximum'],

    'LO': ['Long String', 'Default Character Repertoire and/or as defined by (0008,0005). No backslashes("\\") and ' +
        'no control characters except ESC\n64 chars maximum'],

    'LT': ['Long Text', 'Default Character Repertoire and/or as defined by (0008,0005). A character string ' +
        'that may contain one or more paragraphs. It may contain the Graphic Character set and the ' +
        'Control Characters, CR, LF, FF, and ESC.\nThis VR shall not be multi-valued and therefore ' +
        'character code 5CH (the BACKSLASH "\\" in ISO-IR 6) may be used.\nWe support very limited validation'],

    'OB': ['Other Byte String', 'A string of bytes where the encoding of the contents is specified by the ' +
        'negotiated Transfer Syntax. OB is a VR that is insensitive to Little/Big Endian byte ordering ' +
        '(see Section 7.3). ' +
        'The string of bytes shall be padded with a single trailing NULL byte value (00H) when ' +
        'necessary to achieve even length.\n We do not support ' +
        'validation for this VR at the moment. Edit at your own risk!'],

    'OD': ['Other Double String', 'A string of 64-bit IEEE 754:1985 floating point words. OD is a VR ' +
        'that requires byte swapping within each 64-bit word when changing between Little Endian and Big ' +
        'Endian byte ordering (see Section 7.3).'],

    'OF': ['Other Float String', 'A string of 32-bit IEEE 754:1985 floating point words. OF is a' +
        'VR that requires byte swapping within each 32-bit word when changing between Little Endian ' +
        'and Big Endian byte ordering (see Section 7.3).'],

    'OW': ['Other Word String', 'A string of 16-bit words where the encoding of the contents is specified by the ' +
        'negotiated Transfer Syntax. OW is a VR that requires byte swapping within each word when ' +
        'changing between Little Endian and Big Endian byte ordering (see Section 7.3).\n We do not support ' +
        'validation for this VR at the moment. Edit at your own risk!'],

    'PN': ['Person Name', 'Default Character Repertoire and/or as defined by (0008,0005) excluding Control ' +
        'Characters LF, FF, and CR but allowing Control Character ESC.\nA character string encoded using a 5 ' +
        'component convention. The character code 5CH (the BACKSLASH "\" in ISO-IR 6) shall not be present, ' +
        'as it is used as the delimiter between values in multiple valued data elements. The string may be ' +
        'padded with trailing spaces. For human use, the five components in their order of occurrence are: ' +
        'family name complex, given name complex, middle name, name prefix, name suffix.\nAny of the five ' +
        'components may be an empty string. The component delimiter shall be the caret "^"' +
        'character (5EH)\n64 chars maximum per component group'],

    'SH': ['Short String', 'A character string that may be padded with leading and/or trailing spaces. The ' +
        'character code 05CH (the BACKSLASH "\\" in ISO-IR 6) shall not be present, as it is used as the delimiter ' +
        'between values for multiple data elements. The string shall not have Control Characters except ESC.' +
        '\n16 chars maximum'],

    'SL': ['Signed Long', 'Signed binary integer 32 bits long in 2\'s complement form.' +
        '\nRepresents an integer, n, in the range:\n' +
        '- 2^31 <= n <= 2^31-1.'],

    'SQ': ['Sequence of Items', 'Value is a Sequence of zero or more Items, as defined in Section 7.5.\n' +
        'We do not support validation for this VR at the moment. Edit at your own risk!'],

    'SS': ['Signed Short', 'Signed binary integer 16 bits long in 2\'s complement form. Represents an ' +
        'integer n in the range:\n -2^15<= n <= 2^15-1.'],

    'ST': ['Short Text', 'A character string that may contain one or more paragraphs. It may contain ' +
        'the Graphic Character set and the Control Characters, CR, LF, FF, and ESC. It may be padded ' +
        'with trailing spaces, which may be ignored, but leading spaces are considered to be significant. ' +
        'Data Elements with this VR shall not be multi-valued and therefore character code 5CH ' +
        '(the BACKSLASH "\" in ISO-IR 6) may be used.\n1024 chars maximum\nWe support very limited validation'],

    'TM': ['Time', 'A string of characters of the format HHMMSS.FFFFFF; where HH contains hours ' +
        '(range "00" - "23"), MM contains minutes (range "00" - "59"), SS contains seconds ' +
        '(range "00" - "60"), and FFFFFF contains a fractional part of a second as small as 1 ' +
        'millionth of a second (range "000000" - "999999")\nOne or more of the components MM, SS, or FFFFFF ' +
        'may be unspecified as long as every component to the right of an unspecified component is also ' +
        'unspecified.\nThe FFFFFF component, if present, shall contain 1 to 6 digits.\n' +
        'Example: "070907.0705 " represents a time of 7 hours, 9 minutes and 7.0705 seconds.'],

    'UI': ['Unique Identifier(UID)', '"0"-"9", "." of Default Character Repertoire\n' +
        'The UID is a series of numeric components separated by the period "." character\n64 bytes maximum'],

    'UL': ['Unsigned Long', 'Unsigned binary integer 32 bits long. Represents an integer n in the range:\n' +
        '0 <= n < 2^32.'],

    'UN': ['Unknown', 'A string of bytes where the encoding of the contents is unknown (see Section 6.2.2).\n' +
        'We do not support validation for this VR at the moment. Edit at your own risk!'],

    'US': ['Unsigned Short', 'Unsigned binary integer 16 bits long. Represents integer n in the range:\n' +
        '0 <= n < 2^16.'],

    'UT': ['Unlimited Text', 'Default Character Repertoire and/or as defined by (0008,0005).\n' +
        'A character string that may contain one or more paragraphs. It may contain the Graphic Character ' +
        'set and the Control Characters, CR, LF, FF, and ESC. It may be padded with trailing spaces, ' +
        'which may be ignored, but leading spaces are considered to be significant. Data Elements with ' +
        'this VR shall not be multi-valued and therefore character code 5CH ' +
        '(the BACKSLASH "\\" in ISO-IR 6) may be used.\nWe support very limited validation']
};