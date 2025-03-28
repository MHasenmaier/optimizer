
export function getTodosFromDBAsXml () {
    return `<todos>
    <todo>
        <id>1</id>
        <title>todoTitle 1</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>3</status>
        <tasks>
            <task>1</task>
            <task>2</task>
            <task>5</task>
            <task>10</task>
            <task>11</task>
            <task>12</task>
        </tasks>
    </todo>
    <todo>
        <id>2</id>
        <title>todoTitle 2</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>1</status>
        <tasks>
            <task>3</task>
            <task>4</task>
        </tasks>
    </todo>
    <todo>
        <id>3</id>
        <title>todoTitle 3</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>5</status>
        <tasks>
            <task>6</task>
            <task>7</task>
            <task>8</task>
            <task>9</task>
        </tasks>
    </todo>
    <todo>
        <id>5</id>
        <title>todoTitle 5</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
            <task>13</task>
        </tasks>
    </todo>
        <todo>
        <id>10</id>
        <title>todoTitle 10</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
            <task>14</task>
            <task>15</task>
            <task>16</task>
            <task>17</task>
        </tasks>
    </todo>
        <todo>
        <id>21</id>
        <title>todo ohne task 21</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
        </tasks>
    </todo>
</todos>`;
}

export function getTasksFromDBAsXml () {
    return `<tasks>
    <task>
        <id>1</id>
        <title>Task Titel 1</title>
        <description>Eine kreative Beschreibung für Task 1</description>
        <status>3</status>
        <todo>1</todo>
    </task>
    <task>
        <id>2</id>
        <title>Task Titel 2</title>
        <description>Beschreibung für Task 2: Hier könnte Ihre Werbung stehen!</description>
        <status>1</status>
        <todo>1</todo>
    </task>
    <task>
        <id>3</id>
        <title>Task Titel 3</title>
        <description>Task 3: Machen Sie sich bereit für Abenteuer!</description>
        <status>5</status>
        <todo>2</todo>
    </task>
    <task>
        <id>4</id>
        <title>Task Titel 4</title>
        <description>Für Task 4: Genießen Sie den Moment!</description>
        <status>2</status>
        <todo>2</todo>
    </task>
    <task>
        <id>5</id>
        <title>Task Titel 5</title>
        <description>Beschreibung für Task 5: Ein Schritt nach dem anderen.</description>
        <status>4</status>
        <todo>1</todo>
    </task>
    <task>
        <id>6</id>
        <title>Task Titel 6</title>
        <description>Task 6: Der frühe Vogel fängt den Wurm.</description>
        <status>3</status>
        <todo>3</todo>
    </task>
    <task>
        <id>7</id>
        <title>Task Titel 7</title>
        <description>Für Task 7: Vertrauen ist der Schlüssel.</description>
        <status>5</status>
        <todo>3</todo>
    </task>
    <task>
        <id>8</id>
        <title>Task Titel 8</title>
        <description>Task 8: Kleine Dinge machen einen großen Unterschied.</description>
        <status>2</status>
        <todo>3</todo>
    </task>
    <task>
        <id>9</id>
        <title>Task Titel 9</title>
        <description>Für Task 9: Denken Sie groß, handeln Sie klein.</description>
        <status>1</status>
        <todo>3</todo>
    </task>
    <task>
        <id>10</id>
        <title>Task Titel 10</title>
        <description>Task 10: Erfolg ist kein Zufall.</description>
        <status>4</status>
        <todo>1</todo>
    </task>
    <task>
        <id>11</id>
        <title>Task Titel 11</title>
        <description>Für Task 11: Bleiben Sie neugierig!</description>
        <status>3</status>
        <todo>1</todo>
    </task>
    <task>
        <id>12</id>
        <title>Task Titel 12</title>
        <description>Task 12: Lernen Sie aus Ihren Fehlern.</description>
        <status>5</status>
        <todo>1</todo>
    </task>
    <task>
        <id>13</id>
        <title>Task Titel 13</title>
        <description>Für Task 13: Teilen Sie Ihr Wissen.</description>
        <status>2</status>
        <todo>5</todo>
    </task>
    <task>
        <id>14</id>
        <title>Task Titel 14</title>
        <description>Task 14: Glauben Sie an sich selbst.</description>
        <status>1</status>
        <todo>10</todo>
    </task>
    <task>
        <id>15</id>
        <title>Task Titel 15</title>
        <description>Für Task 15: Bleiben Sie flexibel.</description>
        <status>4</status>
        <todo>10</todo>
    </task>
    <task>
        <id>16</id>
        <title>Task Titel 16</title>
        <description>Task 16: Gemeinsam sind wir stark.</description>
        <status>3</status>
        <todo>10</todo>
    </task>
    <task>
        <id>17</id>
        <title>Task Titel 17</title>
        <description>Für Task 17: Der Weg ist das Ziel.</description>
        <status>5</status>
        <todo>10</todo>
    </task>
</tasks>`;
}
