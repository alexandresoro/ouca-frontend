package fr.lcornithologie.basenaturaliste.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import fr.lcornithologie.basenaturaliste.model.Age;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class AgeServiceTest {

    @Autowired
    private AgeService service;

    @Test
    public void verifieSuppressionClasse() {
	Age age = new Age();
	age.setLibelle("test4");

	service.create(age);

	Age age2 = new Age();
	age2.setLibelle("test5");

	service.create(age2);
    }
}
